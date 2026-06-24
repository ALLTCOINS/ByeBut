#!/usr/bin/env python3
"""
ByeBut Device Agent MVP
Monitors device activity and sends data to Supabase
"""

import os
import sys
import time
import json
import psutil
import requests
from datetime import datetime, timedelta
from typing import Dict, Optional, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ByeButAgent:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        self.device_id = os.getenv('DEVICE_ID')
        self.user_id = os.getenv('USER_ID')
        
        if not all([self.supabase_url, self.supabase_key, self.device_id, self.user_id]):
            print("ERROR: Missing required environment variables")
            print("Required: SUPABASE_URL, SUPABASE_ANON_KEY, DEVICE_ID, USER_ID")
            sys.exit(1)
        
        self.headers = {
            'apikey': self.supabase_key,
            'Authorization': f'Bearer {self.supabase_key}',
            'Content-Type': 'application/json'
        }
        
        self.running = True
        self.last_apps = set()
    
    def get_active_processes(self) -> List[Dict]:
        """Get currently running processes with window titles"""
        processes = []
        try:
            for proc in psutil.process_iter(['pid', 'name', 'exe']):
                try:
                    proc_info = proc.info
                    if proc_info['name']:
                        processes.append({
                            'pid': proc_info['pid'],
                            'name': proc_info['name'],
                            'exe': proc_info.get('exe', '')
                        })
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
        except Exception as e:
            print(f"Error getting processes: {e}")
        return processes
    
    def log_activity(self, activity_type: str, app_name: str, metadata: Dict = None):
        """Send activity log to Supabase"""
        try:
            url = f"{self.supabase_url}/rest/v1/activity_logs"
            data = {
                'device_id': self.device_id,
                'activity_type': activity_type,
                'app_name': app_name,
                'metadata': metadata or {}
            }
            
            response = requests.post(url, headers=self.headers, json=data)
            if response.status_code in [200, 201]:
                print(f"✓ Logged {activity_type}: {app_name}")
            else:
                print(f"✗ Failed to log activity: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Error logging activity: {e}")
    
    def log_usage(self, minutes_used: int):
        """Send usage log to Supabase"""
        try:
            url = f"{self.supabase_url}/rest/v1/usage_logs"
            data = {
                'device_id': self.device_id,
                'minutes_used': minutes_used,
                'date': datetime.now().date().isoformat()
            }
            
            response = requests.post(url, headers=self.headers, json=data)
            if response.status_code in [200, 201]:
                print(f"✓ Logged usage: {minutes_used} minutes")
            else:
                print(f"✗ Failed to log usage: {response.status_code}")
        except Exception as e:
            print(f"Error logging usage: {e}")
    
    def check_rules(self) -> Dict:
        """Check if device should be restricted based on rules"""
        try:
            url = f"{self.supabase_url}/rest/v1/parental_rules"
            params = {
                'device_id': f'eq.{self.device_id}',
                'is_active': 'eq.true',
                'select': '*'
            }
            
            response = requests.get(url, headers=self.headers, params=params)
            if response.status_code == 200:
                rules = response.json()
                return {
                    'time_limit': next((r['time_limit_minutes'] for r in rules if r['rule_type'] == 'time_limit'), None),
                    'blocked_apps': next((r['blocked_categories'] for r in rules if r['rule_type'] == 'content_filter'), [])
                }
        except Exception as e:
            print(f"Error checking rules: {e}")
        
        return {'time_limit': None, 'blocked_apps': []}
    
    def monitor_loop(self, interval_seconds: int = 60):
        """Main monitoring loop"""
        print(f"🚀 ByeBut Agent started for device: {self.device_id}")
        print(f"Monitoring interval: {interval_seconds} seconds")
        print("Press Ctrl+C to stop\n")
        
        session_start = datetime.now()
        total_minutes = 0
        
        while self.running:
            try:
                current_apps = set()
                current_processes = self.get_active_processes()
                
                for proc in current_processes:
                    app_name = proc['name']
                    current_apps.add(app_name)
                    
                    # Log new app openings
                    if app_name not in self.last_apps:
                        self.log_activity('app_opened', app_name, {
                            'pid': proc['pid'],
                            'exe': proc.get('exe', '')
                        })
                
                # Log app closings
                for old_app in self.last_apps - current_apps:
                    self.log_activity('app_closed', old_app)
                
                self.last_apps = current_apps
                
                # Log screen time every interval
                total_minutes += interval_seconds / 60
                self.log_usage(int(total_minutes))
                
                # Check rules periodically
                rules = self.check_rules()
                if rules['time_limit'] and total_minutes >= rules['time_limit']:
                    print(f"⚠️ Time limit reached: {rules['time_limit']} minutes")
                    self.log_activity('rule_violation', 'time_limit', {
                        'limit': rules['time_limit'],
                        'used': int(total_minutes)
                    })
                
                print(f"📊 Active apps: {len(current_apps)} | Total time: {int(total_minutes)} min")
                
            except KeyboardInterrupt:
                print("\n🛑 Shutting down agent...")
                self.running = False
                break
            except Exception as e:
                print(f"Error in monitoring loop: {e}")
            
            time.sleep(interval_seconds)
        
        # Final usage log
        self.log_usage(int(total_minutes))
        print("✓ Agent stopped gracefully")

def main():
    """Main entry point"""
    agent = ByeButAgent()
    
    # Check for command line arguments
    interval = 60  # Default 60 seconds
    if len(sys.argv) > 1:
        try:
            interval = int(sys.argv[1])
        except ValueError:
            print("Invalid interval. Using default 60 seconds")
    
    agent.monitor_loop(interval)

if __name__ == '__main__':
    main()
