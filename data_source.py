#!/usr/bin/env python3

import requests
import sys


URL = "https://data-asg.goldprice.org/dbXRates/USD"
HEADERS = {'User-Agent': 'curl/7.64.1'}

def main():
    try:
        pxs = requests.get(URL, headers=HEADERS).json()
        return pxs['items'][0]['xauPrice']
    except Exception as e:
        raise e

if __name__ == "__main__":
    try:
        print('{0:.2f}'.format(main()))
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)
