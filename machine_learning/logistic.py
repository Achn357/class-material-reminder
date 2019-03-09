##load dataset
from sklearn.datasets import load_digits
digits = load_digits()

data = digits.data 
labels = digits.target

## split data
from sklearn.model_selection import train_test_split
x_train, x_test, y_train, y_test = train_test_split(data, labels, test_size=0.25, random_state=0)

##model
from sklearn.linear_model import LogisticRegression
logistic = LogisticRegression()

##train
logistic.fit(x_train,y_train)

##predict
print(y_test[10])
print(logistic.predict(x_test[10].reshape(1,-1)))

