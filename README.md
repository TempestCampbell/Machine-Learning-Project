# Wine Points and Machine Learning

Predicting wine scores using temperature (low, high, average), precipitation, humidity, and cloudiness for each of the months during the average grape growing season (March-August). Multivariate Linear Regression, Support Vector Regression, and Neural Networks were used.

Previous Project which our machine learning is based on [Wine and Charcuterie](https://github.com/TempestCampbell/Project2)

Presentation of Machine Learning: [Wine Point Predictions](https://docs.google.com/presentation/d/15VnzyvONVWltduQ95HDWQV4EQO8L-cu261JYZhkuWII/edit?usp=sharing)

## Machine Learning Models Worked
- Multivariate Linear Regression
- Support Vector Regression
- Neural Networks
  - Non-Categorical:
  - Categorical

## Analysis
Ultimately, day to day weather doesn't have the largest impact on the score of a wine, and therefore cannot be predicted accurately from the models we used. Climate as a whole has a lot more to do with grape growing, as daily events such as precipitation and humidity can be manipulated using modern technology (irrigation, viticulture techology, etc). It also would be useful to further dig into pulling weather data for different locations throughout the world (this only focused on California), and also to pull more location specific data (soil types, pollution amounts, UV index, etc.). Our wine points data only contained wine with points between 80-100, so finding a dataset with wine points less than 80 could be useful to further analyze weather impacts on scoring. For Neural Networks, smaller category sizes could be useful to provide more prediction accuracy.It would also be really interesting to see how our Machine Learning models would be effected if we were to use wine varietals as a category.


## Further Analyis Needed
Next time provided more time:
- More categories of smaller sizes
- Larger dataset
- More diverse weather data (i.e. pollution)
- Include other areas (i.e. France or other countries)
- More wine to include a wider spread of points
- Look into wine varieties

Other factors to consider:
- Climate
- Technology
- Environmental factors (pollution, soil nutrients, etc.)
- Vine age
