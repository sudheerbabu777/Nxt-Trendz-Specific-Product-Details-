// Write your code here

import './index.css'

const SimilarProductsItem = props => {
  const {similarProductsItemDetails} = props
  const {brand, imageUrl, title, rating, price} = similarProductsItemDetails

  return (
    <li className="item-container">
      <img src={imageUrl} alt={imageUrl} className="image-url" />
      <h1 className="similar-title">{title}</h1>
      <p className="style">{brand}</p>
      <div className="container">
        <p className="similar-price">Rs {price}/- </p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductsItem
