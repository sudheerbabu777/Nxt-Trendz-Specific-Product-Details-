// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarProductsItem from '../SimilarProductItem'

import './index.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const apiStatusView = {
  initial: 'INITIAL',
  inProgress: 'IN PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    similarProducts: [],
    dataDetails: {},
    quality: 1,
    apiStatus: apiStatusView.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    imageUrl: data.image_url,
    id: data.id,
    price: data.price,
    rating: data.rating,
    title: data.title,
    style: data.style,
    totalReviews: data.total_reviews,
  })

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusView.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        dataDetails: updatedData,
        similarProducts: updatedSimilarProductsData,
        apiStatus: apiStatusView.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusView.failure})
    }
  }

  onDecrement = () => {
    const {quality} = this.state
    if (quality > 1) {
      this.setState(prevState => ({quality: prevState.quality - 1}))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({quality: prevState.quality + 1}))
  }

  renderLoaderSpinner = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color=" #3b82f6" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="error-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1 className="error-title">Product Not Found</h1>
      <Link to="/products">
        <button className="shop-button" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductsDetailsEachItem = () => {
    const {dataDetails, quality} = this.state
    const {
      imageUrl,
      title,
      description,
      price,
      totalReviews,
      rating,
      availability,
      brand,
    } = dataDetails

    return (
      <>
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="products-image" />
          <div className="details-container">
            <h1 className="title">{title}</h1>
            <p className="price">{price}/- </p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="total-review">{totalReviews} Review</p>
            </div>
            <p className="description ">{description}</p>
            <div className="stock-container">
              <p className="stock">Available:</p>
              <p className="available">{availability}</p>
            </div>
            <div className="stock-container">
              <p className="stock">Brand:</p>
              <p className="available">{brand}</p>
            </div>

            <hr />

            <div className="quality-container">
              <button
                className="button"
                type="button"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="quality">{quality}</p>
              <button
                className="button"
                type="button"
                onClick={this.onIncrement}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
      </>
    )
  }

  renderSimilarProduct = () => {
    const {similarProducts} = this.state
    return (
      <>
        <h1> Similar Product</h1>
        <ul className="list-container">
          {similarProducts.map(each => (
            <SimilarProductsItem
              similarProductsItemDetails={each}
              key={each.id}
            />
          ))}
        </ul>
      </>
    )
  }

  renderApiCallView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusView.failure:
        return this.renderFailureView()
      case apiStatusView.success:
        return (
          <>
            {this.renderProductsDetailsEachItem()}
            {this.renderSimilarProduct()}
          </>
        )
      case apiStatusView.inProgress:
        return this.renderLoaderSpinner()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-list-container">{this.renderApiCallView()}</div>
      </>
    )
  }
}

export default ProductItemDetails
