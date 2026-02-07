import requests
import os
import csv
from bs4 import BeautifulSoup
import time
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
    
class RmpScraper:
    def Scrape(self, staff_csv_path: str, school_code="1221"):
        csv_list = list[str]()
        out_csv=os.path.join(os.getcwd(), "scrapers", "rmp.csv")
        with open(staff_csv_path, mode ='r') as file:
            csvFile = list(csv.reader(file))
        for staff_member in csvFile:
            role = str(staff_member[4]).lower()
            if (("prof" in role) or ("faculty" in role)):
                url=f"https://www.ratemyprofessors.com/search/professors/{school_code}?q={staff_member[0].lower()}"
                print(url)
                time.sleep(1) 
                response = requests.get(url, headers=REQUEST_HEADERS)
                search_soup = BeautifulSoup(response.text, 'html.parser')
                first_link = search_soup.find("a", class_="TeacherCard__StyledTeacherCard-syjs0d-0 eerjaA")
                if first_link:
                    rmp_school = search_soup.find("div", class_="CardSchool__School-sc-19lmz2k-1 bjvHvb").text
                    if rmp_school == "Wright State University":
                        sub_url=f"https://www.ratemyprofessors.com{first_link['href']}"
                        print(sub_url)
                        time.sleep(1) 
                        response = requests.get(sub_url, headers=REQUEST_HEADERS)
                        soup = BeautifulSoup(response.text, 'html.parser')

                        would_take_again=""
                        level_of_difficulty=""
                        num_ratings=""
                        prof_rating=""
                        rmp_dept=""
                        tags=[]


                        teacher_stats = soup.find_all("div", class_="FeedbackItem__FeedbackNumber-uof32n-1 ecFgca")
                        if teacher_stats:
                            if len(teacher_stats) > 1:
                                would_take_again = str(teacher_stats[0].text)
                                level_of_difficulty = str(teacher_stats[1].text)
                        else:
                            print(f"No teacher stats for {staff_member}")
                        num_ratings_div = soup.find("div", class_="RatingValue__NumRatings-qw8sqy-0 hNMvaE")
                        if num_ratings_div:
                            num_ratings_a = soup.find("a")
                            if num_ratings_a:
                                num_ratings = str(num_ratings_a.text).split('<', 1)[0]
                        prof_rating_div = soup.find("div", class_="RatingValue__Numerator-qw8sqy-2 duhvlP")
                        if prof_rating_div:
                            prof_rating = str(prof_rating_div.text)
                        tags_elements = soup.find_all("span", class_="Tag-bs9vf4-0 bmtbjB")
                        if tags_elements:
                            tags = [tag.get_text(strip=True) for tag in tags_elements]

                        rmp_dept_a = soup.find("a", class_="TeacherDepartment__StyledDepartmentLink-fl79e8-0 fChJtl")
                        if rmp_dept_a:
                            rmp_dept = str(rmp_dept_a.text).split('<', 1)[0]
                        data = [
                            staff_member[0], 
                            staff_member[1], 
                            staff_member[2],
                            staff_member[3],
                            staff_member[4],
                            staff_member[5],
                            staff_member[6],
                            staff_member[7],
                            sub_url,
                            prof_rating,
                            num_ratings,
                            would_take_again,
                            level_of_difficulty,
                            rmp_dept,
                            str(tags)
                        ]
                        print(data)
                        with open(out_csv, mode='a', newline='') as file:
                            writer = csv.writer(file)
                            # writer.writerow(["full_name", "first_name", "last_name", "school", "job_description", "department", "earnings", "year", "rmp_url", "prof_rating", "num_ratings", "would_take_again", "level_of_difficulty", "rmp_dept", "tags"])
                            writer.writerows([data])  
                    else:
                        print(f"NOT A WSU PROF")
                else:
                    print(f"RMP NOT FOUND FOR {staff_member}")
            else:
                print(f"-")

def main():
    payroll = PayrollScraper()
    # payroll.Scrape(in_state="oh", in_school="wright-state-university", in_year="2023", in_begin_page=1)
    rmp = RmpScraper()
    rmp.Scrape(os.path.join(os.getcwd(), "scrapers","salary.csv"))

if __name__=="__main__":
    main()