import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import signInAction from '../../store/actions/auth/signInActions';

import { FlexWrapper } from '../../styles';
import { Message, Loader } from '../../components/UI';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      type: 'customer',
      msg: null,
      success: true,
    };
  }

  inputHandler = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  formHandler = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    if (email && password) {
      await this.props.signInAction(this.state);
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
    const { msg } = this.state;
    const { pending } = this.props.auth;
    console.log(this.state);

    return (
      <div id="sign-in">
        {pending && <Loader />}
        <Message msg={msg} />
        <FlexWrapper>
          <div>
            <h2>Sign In</h2>
            <form action="" onSubmit={this.formHandler}>
              <div>
                <select name="type" onChange={this.inputHandler}>
                  <option value="customer">Customer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label htmlFor="Email">Email</label>
                <input type="email" name="email" onChange={this.inputHandler} />
                <AiOutlineMail className="icon" />
              </div>
              <div>
                <label htmlFor="Password">Password</label>
                <input type="password" name="password" onChange={this.inputHandler} />
                <AiOutlineLock className="icon" />
              </div>
              <div>
                <button>Sign In</button>
                <Link to='/sign-up'>Sign Up</Link>
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
  return bindActionCreators({ signInAction }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);