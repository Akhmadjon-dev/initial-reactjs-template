import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock, AiOutlinePhone, AiOutlineEnvironment } from 'react-icons/ai';
import { FlexWrapper } from '../../styles';
import { Message, Loader } from '../../components/UI';

import { signUp } from '../../store/actions/auth';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      email: '',
      msg: null,
      name: '',
      password: '',
      phone: '',
      success: true,
      type: 'customer'
    };
  }

  inputHandler = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  }

  formHandler = async (e) => {
    e.preventDefault();
    const { name, email, password, phone } = this.state;

    if (name && email && password && phone) {
      await this.props.signUp(this.state);
      const { error, msg } = this.props.auth
      if (error) {
        this.setState({ msg });
      } else {
        this.props.history.push('/');
      }
    } else {
      this.setState({ msg: 'Fill required fileds*' });
    }

  }

  render() {
    const { pending } = this.props.auth;
    const { msg } = this.state;
    return (
      <div id="sign-up">
        {pending && <Loader />}
        <Message msg={msg} />
        <FlexWrapper>
          <div>
            <h2>Sign Up</h2>
            <form action="" onSubmit={this.formHandler}>
              <div>
                <select name="type" onChange={this.inputHandler}>
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label htmlFor="Name">Name*</label>
                <input type="text" name="name" onChange={this.inputHandler} />
                <AiOutlineUser className="icon" />
              </div>
              <div>
                <label htmlFor="Email">Email*</label>
                <input type="email" name="email" onChange={this.inputHandler} />
                <AiOutlineMail className="icon" />
              </div>
              <div>
                <label htmlFor="Password">Password*</label>
                <input type="password" name="password" onChange={this.inputHandler} />
                <AiOutlineLock className="icon" />
              </div>
              <div>
                <label htmlFor="Phone">Phone*</label>
                <input type="phone" name="phone" onChange={this.inputHandler} />
                <AiOutlinePhone className="icon" />
              </div>
              <div>
                <label htmlFor="Address">Address</label>
                <input type="text" name="address" onChange={this.inputHandler} />
                <AiOutlineEnvironment className="icon" />
              </div>
              <div>
                <button>Sign Up</button>
                <Link to='/sign-in'>Sign In</Link>
              </div>
            </form>
          </div>
        </FlexWrapper>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { auth: state.auth }
}
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ signUp }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);