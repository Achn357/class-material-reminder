import matplotlib.pyplot as plt

##load dataset

data = [[]]
counter = 1
for x in range(93):
    data[x].append(counter)
    counter = counter + .25
print(data)
labels = []

## 1 means home and 0 means not home
'''
for x in data:
    if(x < 7.25):
        labels.append(1)
    elif(x >= 7.25 and x < 9.5):
        labels.append(0)
    elif(x >= 9.5 and x < 10.5):
        labels.append(1)
    elif(x >= 10.5 and x < 14):
        labels.append(0)
    elif(x >= 14 and x < 15.25):
        labels.append(1)
    elif(x >= 15.25 and x < 17.5):
        labels.append(0)
    else:
        labels.append(1)


from sklearn.neighbors import KNeighborsClassifier
neigh = KNeighborsClassifier(n_neighbors=3)
neigh.fit(data, labels) 
'''
