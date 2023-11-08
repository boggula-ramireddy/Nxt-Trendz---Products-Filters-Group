import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const displayAllProductsItems = {
  sucess: 'SUCESS',
  fail: 'FAIL',
  inprocess: 'INPROGRESS',
  noproduct: 'NOPRODUCT',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategeryId: categoryOptions[0].categoryId,
    activeRatingId: ratingsList[0].ratingId,
    activeInput: '',
    displayAllProducts: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
      displayAllProducts: displayAllProductsItems.inprocess,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      activeCategeryId,
      activeRatingId,
      activeInput,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategeryId}&title_search=${activeInput}&rating=${activeRatingId}`
    console.log(apiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response.ok)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
      })
      if (updatedData.length > 1) {
        this.setState({displayAllProducts: displayAllProductsItems.sucess})
      } else {
        this.setState({displayAllProducts: displayAllProductsItems.noproduct})
      }
    } else {
      this.setState({displayAllProducts: displayAllProductsItems.fail})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  getActiveCategeryId = id => {
    this.setState({activeCategeryId: id}, this.getProducts)
  }

  getActiveRatingId = id => {
    this.setState({activeRatingId: id}, this.getProducts)
  }

  getActiveInput = id => {
    this.setState({activeInput: id}, this.getProducts)
  }

  clearbutton = () => {
    this.setState(
      {
        activeOptionId: sortbyOptions[0].optionId,
        activeCategeryId: categoryOptions[0].categoryId,
        activeRatingId: ratingsList[0].ratingId,
        activeInput: '',
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderNoProductView = () => (
    <div className="cotainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="no-products"
      />
    </div>
  )

  renderFailureView = () => (
    <div className="cotainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
        alt="products failure"
        className="products-failure"
      />
    </div>
  )

  renderdisplayAllProducts = () => {
    const {displayAllProducts} = this.state
    switch (displayAllProducts) {
      case displayAllProductsItems.sucess:
        return this.renderProductsList()
      case displayAllProductsItems.fail:
        return this.renderFailureView()
      case displayAllProductsItems.noproduct:
        return this.renderNoProductView()
      case displayAllProductsItems.inprocess:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {
      isLoading,
      activeOptionId,
      activeCategeryId,
      activeRatingId,
      activeInput,
    } = this.state
    console.log({activeOptionId, activeCategeryId, activeRatingId, activeInput})

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          getActiveCategeryId={this.getActiveCategeryId}
          getActiveRatingId={this.getActiveRatingId}
          getActiveInput={this.getActiveInput}
          clearbutton={this.clearbutton}
        />
        {this.renderdisplayAllProducts()}
      </div>
    )
  }
}

export default AllProductsSection
