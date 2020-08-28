import React, { PureComponent } from 'react';
import { Link, withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux'
import { signOut } from '../../store/actions/auth/';
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineShopping, AiOutlineUser, AiOutlineTag, AiOutlinePoweroff, AiOutlineLock, AiOutlineLogin } from 'react-icons/ai';
import { Header, NavList, Brand, Button } from '../../styles';
import { ReactComponent as LogoIcon } from '../../assets/logo/logo.svg';
import { ReactComponent as LogoShort } from '../../assets/logo/logo-icon.svg';

import language from '../../lang/header';
import GlobalContext from '../../context/GlobalContext';


class HeaderComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static contextType = GlobalContext;

  signOutHandler = async () => {
    await this.props.signOut();
    this.props.history.push('/sign-in');
  }

  render() {
    const { lang = "en", userType = 'seller' } = this.context;
    const { isAdmin } = this.props;
    const trans = language[lang];

    const URLS = [
      {
        url: '/', exact: true, title: 'Home', icon: <AiOutlineHome />,
      },
      {
        url: '/products', exact: true, title: 'Products', icon: <AiOutlineShoppingCart />,
      },
      {
        url: '/sales', exact: true, title: 'Sales', icon: <AiOutlineShopping />,
      },
      {
        url: '/customers', exact: true, title: 'Customers', icon: <AiOutlineUser />,
      },
      {
        url: '/orders', exact: true, title: 'Orders', icon: <AiOutlineTag />,
      },
      {
        url: '/sign-up', exact: true, title: 'Sign Up', icon: <AiOutlineLogin />,
      },
    ];
    return (
      <Header>
        <nav>
          <Brand>
            <Link to="/" id="logo">
              <LogoIcon id="logo-extend" />
              <LogoShort id="logo-short" />
            </Link>
          </Brand>
          <ul style={{ padding: 0 }}>
            {URLS.map((item) => {
              console.log(item);

              if (!isAdmin) {
                if (!item.admin) {
                  return (
                    <NavList key={item.url}>
                      <NavLink
                        to={item.url}
                        exact={item.exact}
                        activeClassName="active"
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </NavLink>
                    </NavList>
                  )
                }
                return null

              } else {
                return (
                  <NavList key={item.url}>
                    <NavLink
                      to={item.url}
                      exact={item.exact}
                      activeClassName="active"
                    >
                      <span>{item.title}</span>
                    </NavLink>
                  </NavList>
                )
              }
            })}

            <NavList className="text-center">
              <Button
                className="btn-sm active"
                status="danger"
                style={{ minWidth: '50px' }}
                onClick={this.signOutHandler}
              >
                <AiOutlinePoweroff />
                <span>Sign Out</span>
              </Button>
            </NavList>

            <small className="text-center" id="brand"> <a href="https://alitech.uz">Alitech.uz</a> <span>mahsuloti</span></small>
          </ul>
        </nav>
      </Header>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ signOut }, dispatch);
}

export default compose(
  withRouter,
  connect(null, mapDispatchToProps)
)(HeaderComponent);