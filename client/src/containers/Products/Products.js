import React, { Component } from 'react';
import Axios from '../../utils/axios';;

class Products extends Component {
  constructor(props) {
    super(props);

    this.state = { name: '', email: 222, img: '' }
  }

  formHandler = (e) => {
    e.preventDefault();
    const { name, password, email } = this.state;
    const formData = new FormData();
    formData.append('name', name)
    formData.append('password', password);
    formData.append('email', email);
    formData.append('img', this.fileRef.files[0]);
    // Object.values(this.fileRef.files).map(item => {
    //   return formData.append('img', item);
    // })


    Axios.post('/admins/5e27ec35f776429022a1aed8/edit', formData)
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
  }

  render() {
    console.log(this.state);


    return (
      <div>
        <div>
          <input type="text" name="name" onChange={(e) => this.setState({ name: e.target.value })} />
        </div>
        <div>
          <input type="text" name="email" onChange={(e) => this.setState({ email: e.target.value })} />
        </div>
        <div>
          <input type="text" name="password" onChange={(e) => this.setState({ password: e.target.value })} />
        </div>
        <div>
          <input type="file" name="img" multiple accept='image/*' ref={el => this.fileRef = el} onChange={(e) => this.setState({ img: e.target.value })} />
        </div>
        <button onClick={this.formHandler}>Send</button>
      </div>
    )
  }
}

export default Products;