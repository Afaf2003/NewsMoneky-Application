import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'

export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 8,
        category: "general"
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }


    constructor(props) {
        super(props);
        console.log("This is my News.js File for rendering News Component");
        this.state = {
            articles: [],
            loading: false,
            page: 1
        };
        document.title = `${this.CapitalizeFunc(this.props.category)} - NewsMonkey`
    }

    CapitalizeFunc = (word) => {
        return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
    }
    async updateNews() {
        this.props.setProgress(10)
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=213e7ad64632432eb6b14f73a108f988&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true })
        let data = await fetch(url);
        let parseData = await data.json();
        this.props.setProgress(30)
        console.log(parseData);
        this.setState({ articles: parseData.articles, totalResults: parseData.totalResults, loading: false });
        this.props.setProgress(100)
    }
    async componentDidMount() {
        console.log('cdm');
        this.updateNews();
    }
    handlePrevBtn = async () => {

        this.updateNews();
        this.setState({ page: this.state.page - 1 });
    }
    handleNextBtn = async () => {
        this.updateNews();
        this.setState({ page: this.state.page + 1 });
    }

    render() {
        console.log("This is render");
        return (
            <>
                <h2 className='text-center' style={{ margin: '35px 0px' }}>NewsMonkey - Top HeadLines from {this.CapitalizeFunc(this.props.category)}</h2>
                <div className=' container my-3 '>
                    {this.state.loading && <Spinner />}
                    <div className="row">
                        {!this.state.loading && this.state.articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={!element.urlToImage ? "https://www.hindustantimes.com/ht-img/img/2024/02/05/550x309/NASA_discovers_potentially_habitable_super-Earth_1707109205359_1707109211354.png" : element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>

                    <div className="container d-flex justify-content-between my-5">
                        <button disabled={this.state.page <= 1} type="button" onClick={this.handlePrevBtn} className="btn btn-dark">&larr; Previous</button>
                        <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" onClick={this.handleNextBtn} className="btn btn-dark">Next &rarr;</button>
                    </div>
                </div>
            </>
        )
    }
}

export default News
