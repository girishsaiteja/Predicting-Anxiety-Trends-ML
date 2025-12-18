# EDA + REGRESSION + CLUSTERING
# Target Variable: Value (%)

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures, OneHotEncoder, MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.cluster import KMeans


# LOAD DATASET
df = pd.read_csv(
    r"C:\Users\giris\Downloads\Indicators_of_Anxiety_or_Depression_Based_On_Reported_Frequency_of_Symptoms_During_Last_7_Days.csv"
)

df = df[['Indicator', 'Group', 'State', 'Subgroup', 'Time Period', 'Value']].dropna()

#EDA
print("\nDATASET INFORMATION")
print(df.info())

print("\nTARGET VARIABLE SUMMARY")
print(df['Value'].describe())

plt.figure(figsize=(6,4))
sns.histplot(df['Value'], bins=30, kde=True)
plt.title("Distribution of Anxiety/Depression Values")
plt.xlabel("Value (%)")
plt.ylabel("Frequency")
plt.grid(True)
plt.show()

time_trend = df.groupby('Time Period')['Value'].mean()
plt.figure(figsize=(6,4))
plt.plot(time_trend.index, time_trend.values, marker='o')
plt.title("Average Anxiety/Depression Trend Over Time")
plt.xlabel("Time Period")
plt.ylabel("Average Value (%)")
plt.grid(True)
plt.show()

group_avg = df.groupby('Group')['Value'].mean().sort_values()
plt.figure(figsize=(7,4))
group_avg.plot(kind='bar', color='orange')
plt.title("Average Anxiety/Depression by Group")
plt.xlabel("Group")
plt.ylabel("Average Value (%)")
plt.grid(True)
plt.show()

plt.figure(figsize=(4,3))
sns.heatmap(df[['Time Period','Value']].corr(), annot=True, cmap='coolwarm')
plt.title("Correlation Matrix")
plt.show()


# COMMON TARGET
y = df['Value']


#SIMPLE LINEAR REGRESSION (SLR)
X_slr = df[['Time Period']]

X_train, X_test, y_train, y_test = train_test_split(
    X_slr, y, test_size=0.2, random_state=42
)

slr = LinearRegression()
slr.fit(X_train, y_train)
y_pred_slr = slr.predict(X_test)

slr_mse = mean_squared_error(y_test, y_pred_slr)
slr_rmse = np.sqrt(slr_mse)
slr_mae = mean_absolute_error(y_test, y_pred_slr)
slr_r2 = r2_score(y_test, y_pred_slr)

plt.figure(figsize=(6,4))
plt.scatter(X_test, y_test, alpha=0.6, label="Actual")
plt.plot(X_test, y_pred_slr, color='red', label="Regression Line")
plt.title("Simple Linear Regression")
plt.xlabel("Time Period")
plt.ylabel("Value (%)")
plt.legend()
plt.grid(True)
plt.show()

print("SLR PERFORMANCE")
print(f"R² Score : {slr_r2 * 100:.2f}")
print(f"MAE      : {slr_mae * 100:.2f}")
print(f"RMSE     : {slr_rmse * 100:.2f}")
print("-"*40)


#MULTIPLE LINEAR REGRESSION (MLR)
X_cat = df[['Indicator', 'Group', 'State', 'Subgroup']]
X_num = df[['Time Period']]

ohe = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
X_cat_enc = ohe.fit_transform(X_cat)

X_mlr = np.hstack([X_cat_enc, X_num.values])

X_train, X_test, y_train, y_test = train_test_split(
    X_mlr, y, test_size=0.2, random_state=42
)

mlr = LinearRegression()
mlr.fit(X_train, y_train)
y_pred_mlr = mlr.predict(X_test)

mlr_mse = mean_squared_error(y_test, y_pred_mlr)
mlr_rmse = np.sqrt(mlr_mse)
mlr_mae = mean_absolute_error(y_test, y_pred_mlr)
mlr_r2 = r2_score(y_test, y_pred_mlr)

plt.figure(figsize=(6,4))
plt.scatter(y_test, y_pred_mlr, alpha=0.6, color='orange')
min_val = min(y_test.min(), y_pred_mlr.min())
max_val = max(y_test.max(), y_pred_mlr.max())
plt.plot([min_val, max_val], [min_val, max_val], 'r--')
plt.xlabel("Actual Value")
plt.ylabel("Predicted Value")
plt.title("Multiple Linear Regression (Actual vs Predicted)")
plt.grid(True)
plt.show()

print("MLR PERFORMANCE")
print(f"R² Score : {mlr_r2 * 100:.2f}")
print(f"MAE      : {mlr_mae * 100:.2f}")
print(f"RMSE     : {mlr_rmse * 100:.2f}")
print("-"*40)


#POLYNOMIAL REGRESSION (DEGREE = 8)
X_poly_base = df[['Time Period']].values
y_poly = y.values

poly = PolynomialFeatures(degree=8)
X_poly = poly.fit_transform(X_poly_base)

X_train, X_test, y_train, y_test = train_test_split(
    X_poly, y_poly, test_size=0.2, random_state=42
)

poly_model = LinearRegression()
poly_model.fit(X_train, y_train)
y_pred_poly = poly_model.predict(X_test)

poly_mse = mean_squared_error(y_test, y_pred_poly)
poly_rmse = np.sqrt(poly_mse)
poly_mae = mean_absolute_error(y_test, y_pred_poly)
poly_r2 = r2_score(y_test, y_pred_poly)

# Smooth polynomial curve (unchanged)
sorted_idx = np.argsort(X_poly_base.flatten())
X_sorted = X_poly_base[sorted_idx]
X_sorted_poly = poly.transform(X_sorted)
y_sorted_pred = poly_model.predict(X_sorted_poly)

plt.figure(figsize=(6,4))
plt.scatter(X_poly_base, y_poly, alpha=0.4, label="Actual Data")
plt.plot(X_sorted, y_sorted_pred, color='red', linewidth=3,
         label="Polynomial Fit (Degree = 8)")
plt.xlabel("Time Period")
plt.ylabel("Value (%)")
plt.title("Polynomial Regression Curve (Degree = 8)")
plt.legend()
plt.grid(True)
plt.show()

print("POLYNOMIAL REGRESSION PERFORMANCE")
print(f"R² Score : {poly_r2 * 100:.2f}")
print(f"MAE      : {poly_mae * 100:.2f}")
print(f"RMSE     : {poly_rmse * 100:.2f}")
print("-"*40)


#K-MEANS CLUSTERING
df_cluster = df[['Time Period', 'Value']]

scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(df_cluster)

wcss = []
for k in range(1, 8):
    kmeans = KMeans(n_clusters=k, random_state=20, n_init=10)
    kmeans.fit(X_scaled)
    wcss.append(kmeans.inertia_)

plt.figure(figsize=(6,4))
plt.plot(range(1,8), wcss, marker='o')
plt.xlabel("Number of Clusters (K)")
plt.ylabel("WCSS")
plt.title("Elbow Method for K-Means")
plt.grid(True)
plt.show()

kmeans = KMeans(n_clusters=3, random_state=20, n_init=10)
labels = kmeans.fit_predict(X_scaled)

plt.figure(figsize=(6,4))
plt.scatter(df['Time Period'], df['Value'], c=labels, cmap='viridis', alpha=0.6)
plt.xlabel("Time Period")
plt.ylabel("Value (%)")
plt.title("K-Means Clustering (K = 3)")
plt.show()
