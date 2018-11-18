import React, { Component } from 'react';
import './Login.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';

class Login extends Component {
	static propTypes = {
		cookies: instanceOf(Cookies).isRequired
	};

	constructor(props) {
		super(props);

		const {cookies} = props;
		this.state = {
			username: '',
			password: '',
			authenResponse: '',
			registerResponse: '',
			showAuthen: true,
			loggedInUser: cookies.get('user') || '',
			isAuthenticated: false,
			cookies: cookies,
		};
	}

	componentDidMount() {

	}

	register = async e => {
		e.preventDefault();
		const response = await fetch('api/register/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: this.state.username, password: this.state.password }),
		});
		const resp = await response.json();
		this.state.cookies.set('user', this.state.username, { path: '/' });
		this.setState({ authenResponse: '',
						registerResponse: resp.message,
						loggedInUser: this.state.cookies.get('user'),
						isAuthenticated: true,
		});
	}

	authenticate = async e => {
		e.preventDefault();
		const response = await fetch('api/authen/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: this.state.username, password: this.state.password }),
		});
		const resp = await response.json();
		if (resp.verified) {
			this.state.cookies.set('user', this.state.username, { path: '/' });
			this.setState({ authenResponse: resp.message,
							registerResponse: '',
							username: '',
							password: '',
							loggedInUser: this.state.cookies.get('user'),
							isAuthenticated: true,
			});
		} else {
			this.setState({ authenResponse: resp.message,
							registerResponse: '',
							isAuthenticated: false,
			});
		}
	}

	render() {
		if (!this.state.isAuthenticated) {
			return (
				<div className="Login">
					<div className="login">
						<form onSubmit={this.authenticate}>
							<div className="form-group">
								<label for="username">Username :</label>
								<input
									className="form-control"
									value={this.state.username}
									onChange={e => this.setState({ username: e.target.value })}
								/>
							</div>
							<div className="form-group">
								<label for="pwd">Password:</label>
								<input
									className="form-control"
									type="password"
									value={this.state.password}
									onChange={e => this.setState({ password: e.target.value })}
								/>
							</div>
							<div className="btGrp">
								<button type="submit" className="button button3">Login</button>
								<button className="button button3" onClick={this.register}>Register</button>
							</div>
						</form>
					</div>
					<p className="p">{this.state.authenResponse}</p>
					<p className="p">{this.state.registerResponse}</p>
				</div>
			);
		} else {
			return (<Redirect to={"/"+this.state.loggedInUser} />);
		}
	}
}

export default withCookies(Login);