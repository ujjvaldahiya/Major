from datetime import datetime
from csv import DictReader
import pandas as pd
from flask import Flask,render_template
from flask import request
import json
import time
import requests
import numpy as np
from keras.models import Sequential
from sklearn.preprocessing import MinMaxScaler
from keras.layers import Dense, LSTM
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import tensorflow as tf

PORT = 4400
app = Flask(__name__)
@app.route("/data", methods = ['POST'])
def prediction():
    object=request.json
    req=object["req"]
    if req=="YES":
        data = {"Date":[], "Price":[]}
        newdata = {"Date":[], "Price":[]}
        with open("Ethereum Historical Data - Investing.com India(test).csv", encoding='utf-8-sig') as f:
            csv_reader = DictReader(f)
            for row in csv_reader:
                data["Date"].append(row["Date"])
                data["Price"].append(float(row["Price"].replace(",","")))

        data["Date"]= [ datetime.strptime(date, "%b %d, %Y").timestamp() for date in data['Date']]
        df = pd.DataFrame(data)
        X = df[['Date']]
        y = df[['Price']]
        X = X.values
        X = X.reshape(X.shape[0], X.shape[1], 1)
        in_dim = (X.shape[1], X.shape[2])
        out_dim = y.shape[1]
        xtrain, xtest, ytrain, ytest=train_test_split( X, y, test_size=0.20,shuffle = False)
        model = Sequential()
        model.add(LSTM(64, input_shape=in_dim, activation="relu", dropout= 0.2))
        model.add(Dense(out_dim))
        opt = tf.optimizers.Adam(learning_rate = 0.01, clipnorm = 1.0)

        model.compile(loss="mse", optimizer=opt) 

        model.fit(xtrain, ytrain, batch_size=4, epochs=100, verbose=0)
        ypred = model.predict(xtest) #arr [[], [], []]
        j = (ytest.index.values)
        epoch_list = []
        for x in j:
            epoch_list.append(df.at[x, 'Date'])
        epoch_list = np.array(epoch_list)
        ytest_np = ytest.to_numpy()
        test_vals = np.append(ytest_np,epoch_list[:,None],axis=1)
        for val in ypred:
            newdata['Price'].append((val[0]).item())
        for row in test_vals:
            newdata['Price'].append((row[0]))
            newdata['Date'].append((row[1]))
        return newdata
    else:
        return "NOT VALID REQUEST"

if __name__ ==("__main__"):
    print("Emitter flask server is running...")
    print(f"listening at port {PORT}...")
    app.run(host='0.0.0.0',debug=True,port=PORT)