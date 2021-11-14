//@ts-nocheck
import React from "react"
import axios from "axios"
import { Redirect } from "react-router"
import { Glyphicon } from "react-bootstrap"

interface AddToCartProps {
  bookId: string
  price: number
  variant?: string
}

interface AddToCartState {
  loading: boolean
  toCart: boolean
}

class AddToCart extends React.Component<AddToCartProps, AddToCartState> {
  constructor(props: AddToCartProps) {
    super(props)

    this.state = {
      loading: false,
      toCart: false,
    }
  }

  onAddToCart = async () => {
    this.setState({ loading: true })
    // const bookInCart = await API.get("cart", /cart/${this.props.bookId}, null);
    let bookInCart
    const invokeUrl =
      "https://grmwr7jyf3.execute-api.us-east-1.amazonaws.com/dev"
    try {
      const res = await axios.get(`${invokeUrl}/books/${this.props.bookId}`)
      console.log(res)
      bookInCart = res.data
    } catch (e) {
      alert(e)
    }
    console.log(bookInCart)
    // if the book already exists in the cart, increase the quantity
    if (bookInCart.length) {
      console.log("in if")
      let params = {
        bookId: this.props.bookId,
        quantity: bookInCart.quantity + 1,
      }
      try {
        const res = await axios.put(`${invokeUrl}/cart`, params).then(() =>
          this.setState({
            toCart: true,
          })
        )
        bookInCart = res.data
      } catch (e) {
        alert(e)
      }
    }

    // if the book does not exist in the cart, add it
    else {
      console.log("in else")

      let params = {
        bookId: this.props.bookId,
        price: this.props.price,
        quantity: 1,
      }
      try {
        const res = await axios.post(`${invokeUrl}/cart`, params).then(() =>
          this.setState({
            toCart: true,
          })
        )
        bookInCart = res.data
      } catch (e) {
        alert(e)
      }
    }
  }

  getVariant = () => {
    let style = "btn btn-black"
    return this.props.variant && this.props.variant === "center"
      ? style + ` btn-black-center`
      : style + ` pull-right`
  }

  render() {
    if (this.state.toCart) return <Redirect to="/cart" />

    return (
      <button
        className={this.getVariant()}
        disabled={this.state.loading}
        type="button"
        onClick={this.onAddToCart}
      >
        {this.state.loading && (
          <Glyphicon glyph="refresh" className="spinning" />
        )}
        {this.props.variant === "buyAgain" ? `Buy again` : `Add to cart`}
      </button>
    )
  }
}

export default AddToCart
