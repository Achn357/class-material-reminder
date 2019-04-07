import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn import metrics

#getting data
rawdata = pd.read_csv("homedata.csv")

#features is 'data' and labels is 'labels'
data = rawdata[['time','day']]
labels = rawdata['is home']

#splitting data
X_train, X_test, y_train, y_test = train_test_split(data, labels, test_size=0.3, random_state=1)
clf = DecisionTreeClassifier()
clf = clf.fit(X_train,y_train)


y_pred = clf.predict(X_test)
print("Accuracy:",metrics.accuracy_score(y_test, y_pred))
