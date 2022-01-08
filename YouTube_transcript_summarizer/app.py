from nltk.cluster.util import cosine_distance
from nltk.corpus import stopwords
import numpy as np
import networkx as nx
from youtube_transcript_api import YouTubeTranscriptApi
from flask import Flask, jsonify

def read_file(result):
    article = result.split('. ')
    sentences = []
    for sentence in article:
        sentences.append(sentence.replace("[^a-zA-Z]"," ").split(" "))
    sentences.pop()
    return sentences

def similarity(s1, s2, stopwords=None):
    if stopwords is None:
        stopwords = []
    s1=[w.lower() for w in s1]
    s2=[w.lower() for w in s2]
    all_words = list(set(s1+s2))
    v1=[0]*len(all_words)
    v2=v1
    for w in s1:
        if w in stopwords:
            continue
        v1[all_words.index(w)] += 1
    for w in s2:
        if w in stopwords:
            continue
        v2[all_words.index(w)] += 1
    return 1-cosine_distance(v1, v2)

def sim_matrix(sentenses, stop_words):
    matrix = np.zeros((len(sentenses), len(sentenses)))
    for id1 in range(len(sentenses)):
        for id2 in range(len(sentenses)):
            if id1==id2:
                continue
            matrix[id1][id2]=similarity(sentenses[id1], sentenses[id2], stop_words)
    return matrix

def summary(file_name, top_n):
    stop_words=stopwords.words('english')
    sum_text = []
    sentences = read_file(file_name)
    sent_sim_matrix = sim_matrix(sentences, stop_words)
    sent_sim_graph = nx.from_numpy_array(sent_sim_matrix)
    scores = nx.pagerank(sent_sim_graph)
    ranked_sentence = sorted(((scores[i], s)for i, s in enumerate(sentences)), reverse=True)
    for i in range(top_n):
        sum_text.append(" ".join(ranked_sentence[i][1]))
    summary = ''
    for i in sum_text:
        summary+= i + " - "
    summary = summary[:-3]
    #print(summary)
    return summary

def yttranscript(vid, lines = 10, spl=3):
    youtube_video = vid
    video_id = youtube_video#.split("=")[1]
    YouTubeTranscriptApi.get_transcript(video_id)
    transcript = YouTubeTranscriptApi.get_transcript(video_id)

    result = ""
    a=0
    for i in transcript:
        a=a+1
        if a==1:
            result += i['text']
        elif a%spl==0:  
            result += '. ' + i['text']
        else:
            result += ' '+i['text']
    summary(result, lines)
    yts = summary(result, lines)
    return yts

app = Flask(__name__)

@app.route("/")
def index():
    return yttranscript("https://www.youtube.com/watch?v=q6oiRtKTpX4", 20, 3)

@app.route("/yts", methods=['GET'])
def get():
    data={"sumary":"YTS"}
    return jsonify(data)

@app.route("/yts/<string:link>", methods=['GET'])
async def ytslink(link):
    data={"summary": yttranscript(link)}
    return jsonify(data)

@app.route("/yts/<string:link>/<int:lines>", methods=['GET'])
async def ytslinklines(link, lines):
    return yttranscript(link, lines)

@app.route("/yts/<string:link>/<int:lines>/<int:spl>", methods=['GET'])
async def ytslinklinesspl(link, lines, spl):
    return yttranscript(link, lines, spl)

if __name__ == "__main__":
    app.run(debug=True)