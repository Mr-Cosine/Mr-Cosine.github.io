from selenium import webdriver
from selenium.webdriver.firefox.options import Options
import os
import time;

# 1. Update this to your copied profile path
PROFILE_PATH = r"C:\Users\Jiaqi\Desktop\h7lxgegg.default-release"
EXTENSION_PATH = os.path.abspath(r"D:\Coding projects\SciHelper")
addon_id = "scihelper@yourdomain.com"

options = Options()
options.add_argument("-profile")
options.add_argument(PROFILE_PATH)

# Use a Service object to point to geckodriver if it's not in PATH
driver = webdriver.Firefox(options=options)

try:
    # 1. Install the addon while on a blank page (about:blank)
    driver.install_addon(EXTENSION_PATH, temporary=True)
    print("Addon installed.")
    
    # 3. NOW navigate to the Google Doc
    # Because the addon is already installed, the content script will inject naturally
    driver.get("https://www.editpad.org")
    
    print("✅ Browser opened, extension loaded, and navigating to Docs.")

    # 4. Wait for the editor to actually exist before running your JS
    time.sleep(1) 
    
    driver.refresh()  # Refresh to ensure content script is injected

    input("Test is running. Press Enter in this terminal to close the browser...")
finally:
    driver.quit()