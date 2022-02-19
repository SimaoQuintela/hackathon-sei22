from z3 import *
from ortools.linear_solver import pywraplp
def addtime(hour, minutes):
    return (hour,minutes+15) if minutes != 45 else (hour+1,0)

def normalize(hour):
    return (int(hour.split(':')[0]), int(hour.split(':')[1]))


def convert(timetable):
    solver = pywraplp.Solver('BOP', pywraplp.Solver.BOP_INTEGER_PROGRAMMING)
    slots = {}
    for day in timetable:

        hours = [normalize(t) for t in timetable[day]]

        slots[day] = {}
        for time_slot in timetable[day]:


            time = normalize(time_slot)

            content = timetable[day][time_slot]

            slots[day][time] = {}
            slots[day][time][content] = solver.BoolVar("slots[%s][(%i,%i)][%s]" % (day, time[0], time[1], content))
            if content != "Free":
                solver.Add(slots[day][time][content] == 1)


            next = addtime(time[0],time[1])
            while next not in hours and next[0] != 24:
                #print(next)
                time = next
                slots[day][time] = {}
                slots[day][time][content] = solver.BoolVar("slots[%s][(%i,%i)][%s]" % (day, time[0], time[1], content))
                if content != "Free":
                    solver.Add(slots[day][time][content] == 1)

                next = addtime(time[0], time[1])



    return slots




horario = {"Monday":{"08:00":"SO","09:00":"Free","16:00":"PA","17:15":"LC","19:45":"Free"}}
print(convert(horario))

def denormalize(tuple):
    return "%02d:%02d" % (tuple[0], tuple[1])
#print(denormalize((8,0)))


def revert(solver):
    timetable = {}
    task = ''
    for day in solver:
        timetable[day] = {}
        for time in solver[day]:
            ft = denormalize(time)
            if solver[day][time] != task:
                timetable[day][ft] = list(solver[day][time].keys())[0]
                task = solver[day][time]
    return timetable
print(horario == revert(convert(horario)))

