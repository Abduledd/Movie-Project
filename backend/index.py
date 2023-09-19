from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests

app = Flask(__name__)
CORS(app)

df = pd.read_csv('dataset.csv')

# Remplacer les valeurs manquantes dans 'genre' par "Unknown"
df['genre'].fillna('Unknown', inplace=True)

# Remplacer les valeurs manquantes dans 'overview' par "No overview available"
df['overview'].fillna('No overview available', inplace=True)

#Now to define the model we should create one feature and Combine 'overview' and 'genre' into a single string for each movie
df['combined_text'] = df['overview'] + ' ' + df['genre']


# Initialize CountVectorizer to convert text to vectors
vectorizer = CountVectorizer(stop_words='english')
combined_matrix = vectorizer.fit_transform(df['combined_text'])

# Calculate cosine similarity between combined text
cosine_sim_combined = cosine_similarity(combined_matrix, combined_matrix)

# # Function to recommend similar movies based on cosine similarity
# def recommend_similar_movies(movie_title, num_recommendations=5):
#     movie_index = df[df['title'] == movie_title].index[0]
#     similar_movies = list(enumerate(cosine_sim_combined[movie_index]))
#     sorted_similar_movies = sorted(similar_movies, key=lambda x: x[1], reverse=True)
#     top_similar_movies = sorted_similar_movies[1:num_recommendations + 1]
#     recommended_movie_indices = [index for index, _ in top_similar_movies]
#     return df.iloc[recommended_movie_indices]



def fetch_poster(movie_id):
    url = "https://api.themoviedb.org/3/movie/{}?api_key=c7ec19ffdd3279641fb606d19ceb9bb1&language=en-US".format(
        movie_id)
    data = requests.get(url)
    data = data.json()
    poster_path = data['poster_path']
    full_path = "https://image.tmdb.org/t/p/w500/"+poster_path
    return full_path

def twenty_movies():
    df_20 = df.sample(20, random_state=0)[['id','title']]
    return df_20


def recommend_similar_movies(movie_title, num_recommendations=5):
    movie_index = df[df['title'] == movie_title].index[0]
    similar_movies = list(enumerate(cosine_sim_combined[movie_index]))
    sorted_similar_movies = sorted(similar_movies, key=lambda x: x[1], reverse=True)
    top_similar_movies = sorted_similar_movies[1:num_recommendations + 1]
    recommended_movie_indices = [index for index, _ in top_similar_movies]
    
    # Convert the selected rows into a list of dictionaries
    recommended_movies = []
    recommended_poster = []
    for index in recommended_movie_indices:
        recommended_movies.append(df.iloc[index].to_dict())
        recommended_poster.append(fetch_poster(df.iloc[index]['id']))
    return recommended_movies, recommended_poster

@app.route('/api/recommendations', methods=['GET','POST'])
def get_recommendations():
    print('start function recommended')
    if request.method == 'GET':
        print("get")
        return "Use a POST request to get recommendations."
    print('ok')
    movie_title = request.json['movie']
    num_recommendations = request.json.get('num_recommendations', 5)
    recommendations, posters = recommend_similar_movies(movie_title, num_recommendations)
    return jsonify({'recommendations': recommendations, 'posters':posters})

@app.route('/api/movie_titles', methods=['GET'])
def get_movie_titles():
    movie_titles = df['title'].tolist()
    movies_20_titles = twenty_movies()['id']
    movies_20_id=[]
    for id in movies_20_titles :
        movies_20_id.append({"id":int(id)})
    return jsonify({'movie_titles': movie_titles, 'movies_20_titles':movies_20_titles, 'movies_20_id':movies_20_id })



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    print("app lanced")