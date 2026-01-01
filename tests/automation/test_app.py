from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import pytest

def test_site_title():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    # Explicitly point to the Chromium binary installed via apt
    chrome_options.binary_location = "/usr/bin/chromium"
    
    # Use the system driver installed via apt
    service = Service("/usr/bin/chromedriver")
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    try:
        driver.get("https://perfmon.nightcloud.systems")
        assert "Performance Monitor" in driver.title
        print("\n✅ Success: Performance Monitor is live!")
    finally:
        driver.quit()
