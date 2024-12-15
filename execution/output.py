class Student:
    def __init__(self, name, grades):
        self.name = name
        self.grades = list(map(float, grades))
    
    def average_grade(self):
        return sum(self.grades) / len(self.grades)
    
    def has_passed(self, passing_grade=50):
        return self.average_grade() >= passing_grade

def parse_input(input_data):
    students = []
    for line in input_data.strip().split("\n"):
        parts = line.split(",")
        name = parts[0]
        grades = parts[1:]
        students.append(Student(name, grades))
    return students

if __name__ == "__main__":
    import sys
    input_data = sys.stdin.read()
    students = parse_input(input_data)
    
    print("Student Analysis:")
    for student in students:
        average = student.average_grade()
        status = "Passed" if student.has_passed() else "Failed"
        print(f"  - {student.name}: Average Grade = {average:.2f}, Status = {status}")
