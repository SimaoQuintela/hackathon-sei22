from z3 import *
from ortools.linear_solver import pywraplp
def addtime(hour, minutes):
    return (hour,minutes+15) if minutes != 45 else (hour+1,0)

def normalize(hour):
    return (int(hour.split(':')[0]), int(hour.split(':')[1]))


def convert(timetable,solver):

    tasks = set()
    for day in timetable:
        for hour in timetable[day]:
            if timetable[day][hour] != "Free":
                tasks.add(timetable[day][hour])
    print(tasks)
    slots = {}
    for day in timetable:

        hours = [normalize(t) for t in timetable[day]]

        slots[day] = {}
        for time_slot in timetable[day]:

            time = normalize(time_slot)

            cur = timetable[day][time_slot]

            slots[day][time] = {}
            for content in tasks:
                slots[day][time][content] = solver.BoolVar("slots[%s][(%i,%i)][%s]" % (day, time[0], time[1], content))
                if cur != "Free" and content == cur:
                    solver.Add(slots[day][time][cur] == 1)

            nextt = addtime(time[0], time[1])
            while nextt not in hours and nextt[0] != 24:
                #print(next)
                time = nextt
                slots[day][time] = {}
                for content in tasks:
                    slots[day][time][content] = solver.BoolVar("slots[%s][(%i,%i)][%s]" % (day, time[0], time[1], content))
                    if cur != "Free" and content == cur:
                        solver.Add(slots[day][time][cur] == 1)

                nextt = addtime(time[0], time[1])
    print(slots)
    return slots,tasks




horario = {"Monday":{"08:00":"SO","09:00":"Free","16:00":"PA","17:15":"LC","19:45":"Free"}}
dinamico = {"Ginasio":{ "hours": "02:00", "morning": True, "afternoon": True, "night": False, "late_night": False,"days": {"monday": True}, "time": "01:00", "is_fixed": False}}


def denormalize(tuple):
    return "%02d:%02d" % (tuple[0], tuple[1])
#print(denormalize((8,0)))


def revert(solver,tasks,res):
    timetable = {}
    cur = ''
    for day in solver:
        timetable[day] = {}
        for time in solver[day]:
            ft = denormalize(time)
            if cur != "Free" and sum([solver[day][time][task].solution_value() for task in tasks]) == 0:
                timetable[day][ft] = "Free"
                cur = "Free"
            else:
                for task in tasks:
                    if task != cur and solver[day][time][task].solution_value() == 1:
                        timetable[day][ft] = task
                        cur = task
    return timetable
#print(horario == revert(convert(horario)))

def addDynamic(fixed, dynamic):
    solver = pywraplp.Solver('BOP', pywraplp.Solver.BOP_INTEGER_PROGRAMMING)
    slots,tasks = convert(fixed,solver)

    for task in dynamic:
        for day in slots:
            for slot in slots[day]:
                slots[day][slot][task] = solver.BoolVar("slots[%s][(%i,%i)][%s]" % (day, slot[0], slot[1], task))



    # nao pode haver sobreposiçao
    for day in slots:
        for slot in slots[day]:
            print(slots[day][slot][task])
            solver.Add(sum([slots[day][slot][task] for task in tasks]) <= 1)

    # as tarefas cumprem o manha/tarde/noite
    for day in slots:

        for slot in slots[day]:
            if (8, 0)<= slot < (12, 0):
                print(slot)
                for task in dynamic:
                    print(slots[day][slot][task])
                    solver.Add(slots[day][slot][task] <= int(dynamic[task]['morning']))

            elif (13, 0)<= slot < (20, 0):
                for task in dynamic:
                    solver.Add(slots[day][slot][task] <= int(dynamic[task]['afternoon']))
            elif (21, 0)<= slot < (24, 0):
                for task in dynamic:
                    solver.Add(slots[day][slot][task] <= int(dynamic[task]['night']))
            else:
                for task in dynamic:
                    solver.Add(slots[day][slot][task] <= int(dynamic[task]['late_night']))





    r = solver.Solve()
    print(slots)
    if r == pywraplp.Solver.OPTIMAL:
        return revert(slots,tasks,r)
print(addDynamic(horario, dinamico))
'''
for y in range(N ** 2):
    for x in range(N ** 2):
        for c in range(N ** 2):
            mat[y][x][c] = round(matriz[y][x][c].solution_value())
'''


