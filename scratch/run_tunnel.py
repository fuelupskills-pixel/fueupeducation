import subprocess
import time
import sys
import os

log_file_path = "scratch/localtunnel.log"

print(f"Starting localtunnel and redirecting output to {log_file_path}...")
try:
    with open(log_file_path, "w", encoding="utf-8") as f:
        # Run npx -y localtunnel --port 8000
        # Shell=True is needed on Windows for npx
        proc = subprocess.Popen(
            ["npx", "-y", "localtunnel", "--port", "8000"],
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        # Read output and write to file immediately
        start_time = time.time()
        while True:
            line = proc.stdout.readline()
            if not line:
                if proc.poll() is not None:
                    break
                time.sleep(0.5)
                continue
                
            print(f"Tunnel Output: {line.strip()}")
            f.write(line)
            f.flush()
            
            # Stop printing to terminal after 15 seconds to avoid flooding, but keep writing to file
            if time.time() - start_time > 15:
                print("Logging continues in background...")
                # Write rest of output to file
                for l in proc.stdout:
                    f.write(l)
                    f.flush()
                break
                
except Exception as e:
    print("Error starting localtunnel:", e)
