import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    getActiveCategeryId,
    getActiveRatingId,
    getActiveInput,
    clearbutton,
  } = props

  const onChangeInput = event => {
    getActiveInput(event.target.value)
  }
  const onclickCategery = event => {
    getActiveCategeryId(event.target.value)
  }
  const onclickRating = event => {
    getActiveRatingId(event.target.alt)
  }
  const onClearButton = () => {
    clearbutton()
  }

  return (
    <div className="filters-group-container">
      <input
        type="search"
        className="input-container"
        onChange={onChangeInput}
      />
      <h1>Category</h1>
      {categoryOptions.map(each => (
        <button
          type="button"
          className="filter-button"
          onClick={onclickCategery}
          value={each.categoryId}
        >
          <p>{each.name}</p>
        </button>
      ))}
      <h1>Rating</h1>
      {ratingsList.map(each => (
        <button type="button" className="filter-button" onClick={onclickRating}>
          <div>
            <img
              src={each.imageUrl}
              className="rating-img"
              alt={each.ratingId}
            />
            &up
          </div>
        </button>
      ))}

      <button type="button" className="clear-button" onClick={onClearButton}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
