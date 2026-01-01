from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.binary_location = "/usr/bin/chromium"

service = Service("/usr/bin/chromedriver")
driver = webdriver.Chrome(service=service, options=chrome_options)

print("\n--- NAVIGATING TO LOGIN PAGE ---")
driver.get("http://localhost:3001")
time.sleep(2)

print("\n--- LOGIN FORM HTML ---")
# Find the form or just dump all inputs
inputs = driver.find_elements(By.TAG_NAME, "input")
for i, inp in enumerate(inputs):
    print(f"INPUT #{i}: Outer HTML: {inp.get_attribute('outerHTML')}")

buttons = driver.find_elements(By.TAG_NAME, "button")
for i, btn in enumerate(buttons):
    print(f"BUTTON #{i}: Outer HTML: {btn.get_attribute('outerHTML')}")

print("\n-----------------------")
driver.quit()
