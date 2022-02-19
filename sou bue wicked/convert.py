from z3 import *
def addtime(hour, minutes):
    return (hour,minutes+15) if minutes != 45 else (hour+1,0)

def normalize(hour):
    return (int(hour.split(':')[0]), int(hour.split(':')[1]))


def convert(timetable):
    slots = {}
    for day in timetable:

        hours = [normalize(t) for t in timetable[day]]
        print(hours)
        slots[day] = {}
        for time_slot in timetable[day]:
            print(time_slot)

            time = normalize(time_slot)
            #print(time)
            content = timetable[day][time_slot]

            slots[day][time] = {}
            if content != "Free":
                slots[day][time][content] = 1
            else:
                slots[day][time][content] = 0
            print(slots)
            next = addtime(time[0],time[1])
            while next not in hours and next[0] != 24:
                print(next)
                time = next
                slots[day][time] = {}
                if content != "Free":
                    slots[day][time][content] = 1
                else:
                    slots[day][time][content] = 0
                next = addtime(time[0], time[1])



    return slots





horario = {"Monday":{"8:00":"SO","9:00":"Free","16:00":"PA","17:15":"LC","19:45":"Free"}}
print(convert(horario))


#print(normalize("9:00"))