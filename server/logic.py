from ortools.linear_solver import pywraplp
def addtime(hour, minutes):
    return (hour%24,minutes+15) if minutes != 45 else ((hour+1)%24,0)

def normalize(hour):
    return (int(hour.split(':')[0]), int(hour.split(':')[1]))

def convert(timetable,solver):
    tasks = set()
    for day in timetable:
        for hour in timetable[day]:
            if timetable[day][hour] != "Free":
                tasks.add(timetable[day][hour])
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
                time = nextt
                slots[day][time] = {}
                for content in tasks:
                    slots[day][time][content] = solver.BoolVar("slots[%s][(%i,%i)][%s]" % (day, time[0], time[1], content))
                    if cur != "Free" and content == cur:
                        solver.Add(slots[day][time][cur] == 1)

                nextt = addtime(time[0], time[1])
    return slots,tasks

horario = {
            "Monday":{"08:00":"SO","09:00":"Free","16:00":"PA","17:15":"LC","19:45":"Free"},
            "Tuesday":{"08:00":"Free", "13:30":"PA", "14:00": "Free"},
            "Wednesday":{"09:00":"PI","11:00":"LA1","15:00":"AUC","17:00":"Free"},
            "Thursday":{"14:00":"Violino","18:00":"Free"},
            "Friday":{"11:00":"PI","17:00":"LC","19:00":"Free"}
           }
dinamico = {"Ginasio":
                { "hours": "01:00",
                  "morning": False,
                  "afternoon": True,
                  "night": False,
                  "late_night": False,
                  "days":
                      {
                        "Monday": False,
                        "Tuesday":True,
                        "Wednesday":True,
                        "Thursday":False,
                        "Friday":True
                    },
                  "time": "01:00",
                  "is_fixed": True},
            "Passear o cao":
                { "hours": "02:00",
                  "morning": False,
                  "afternoon": False,
                  "night": True,
                  "late_night": False,
                  "days":
                      {
                        "Monday": False,
                        "Tuesday":False,
                        "Wednesday":True,
                        "Thursday":False,
                        "Friday":True
                    },
                  "time": "00:30",
                  "is_fixed": False}
            }

def denormalize(tuple):
    return "%02d:%02d" % (tuple[0], tuple[1])

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

def addDynamic(fixed, dynamic):
    solver = pywraplp.Solver('BOP', pywraplp.Solver.BOP_INTEGER_PROGRAMMING)
    slots,tasks = convert(fixed,solver)

    for task in dynamic:
        for day in slots:
            for slot in slots[day]:
                slots[day][slot][task] = solver.BoolVar("slots[%s][(%i,%i)][%s]" % (day, slot[0], slot[1], task))

    tasks.update(dynamic)

    # There cant be overlaping slots
    for day in slots:
        for slot in slots[day]:
            solver.Add(sum([slots[day][slot][task] for task in tasks]) <= 1)

    # The tasks respect their time period
    for day in slots:

        for slot in slots[day]:
            if (8, 0) <= slot < (12, 0):
                for task in dynamic:
                    solver.Add(slots[day][slot][task] <= int(dynamic[task]['morning']))

            elif (13, 0) <= slot < (20, 0):
                for task in dynamic:
                    solver.Add(slots[day][slot][task] <= int(dynamic[task]['afternoon']))
            elif (21, 0) <= slot < (24, 0):
                for task in dynamic:
                    solver.Add(slots[day][slot][task] <= int(dynamic[task]['night']))
            elif (0,0)<= slot < (7,0):
                for task in dynamic:
                    solver.Add(slots[day][slot][task] <= int(dynamic[task]['late_night']))
            else:
                for task in dynamic:
                    solver.Add(slots[day][slot][task] == 0)
    
    # Each task has the number of slots required
    for task in dynamic:
        time = normalize(dynamic[task]['hours'])

        total_h = int(4 * time[0] + time[1] / 15)
        solver.Add(sum([slots[day][slot][task] for day in slots for slot in slots[day]]) == total_h)
    
    # A task can only be assigned to the day it is allowed
    for day in slots:
        for slot in slots[day]:
            for task in dynamic:
                solver.Add(slots[day][slot][task] <= dynamic[task]["days"][day])

    # # A fixed task needs to have all slots together
    # for task in dynamic:
    #     if dynamic[task]["is_fixed"]:
    #         time = normalize(dynamic[task]['time'])

    #         total_s = int(4 * time[0] + time[1] / 15)
    #         for day in slots:
    #             for slot in slots[day]:
    #                 wicked = slot
    #                 for i in range(1,total_s+1):
    #                     solver.Add(slots[day][slot][task] == 1)
    #                     wicked=addtime(wicked[0], wicked[1])





    r = solver.Solve()
    if r == pywraplp.Solver.OPTIMAL:

        # for x in slots:
        #     for y in slots[x]:
        #         for z in slots[x][y]:
        #             print(rf"{x}, {y}, {z},{slots[x][y][z].solution_value()}")
        return revert(slots, tasks, r)

if __name__ == '__main__':
    print(addDynamic(horario, dinamico))