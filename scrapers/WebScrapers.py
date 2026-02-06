import requests
import os
import csv
from bs4 import BeautifulSoup

PAYROLL_BASE_URL="https://opengovpay.com/employer"
REQUEST_HEADERS={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0",
    }

class PayrollScraper:
    def Scrape(self, in_state: str, in_school: str, in_year: str, in_begin_page=1):
        """
        Docstring for Scrape
        
        :param in_state: Description
        :type in_state: str
        :param in_school: Description
        :type in_school: str
        :param in_year: Description
        :type in_year: str
        :param in_begin_page: Description
        :return: Description
        :rtype: int
        """
        
        salary_dir=os.path.join(os.getcwd(), "scrapers", "raw_data")
        out_csv = os.path.join(os.getcwd(), "scrapers", "salary.csv")
        csv_array = list[str]()

        html_files = [
            f for f in os.listdir(salary_dir)
            if f.lower().endswith(".htm") and os.path.isfile(os.path.join(salary_dir, f))
        ]
        for html_file in html_files:
            with open(os.path.join(salary_dir, html_file), "r", encoding="utf-8") as f:
                print(html_file)
                soup = BeautifulSoup(f, "html.parser")
                table_wrapper = soup.find("div", class_="results-table-wrapper")
                if table_wrapper:
                    rows = table_wrapper.find_all("tr")
                    if rows:
                        for i in range(1, len(rows)):
                            columns = rows[i].find_all("td")
                            if columns:
                                name_parts = str(columns[0].text).split()
                                data = [
                                    columns[0].text, 
                                    name_parts[0],
                                    name_parts[1],
                                    columns[1].text,
                                    columns[2].text,
                                    columns[3].text,
                                    str(columns[4].text).strip(),
                                    columns[5].text
                                ]
                                csv_array.append(data)
                            else:
                                print(f"COLUMNS {i} is null")
                    else:
                        print("ROWS is null")
                else:
                    print("TABLE_WRAPPER is null")
                
                if len(csv_array) > 0:
                    with open(out_csv, mode='w', newline='') as file:
                        writer = csv.writer(file)
                        writer.writerow(["full_name", "first_name", "last_name", "school", "job_description", "department", "earnings", "year"])
                        writer.writerows(csv_array)  
        return
    
def main():
    payroll = PayrollScraper()
    payroll.Scrape(in_state="oh", in_school="wright-state-university", in_year="2023", in_begin_page=1)

if __name__=="__main__":
    main()