import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Chat from './Chat';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Route, Switch, Redirect } from 'react-router-dom';

class App extends Component {
	static propTypes = {
		cookies: instanceOf(Cookies).isRequired
	};

	constructor(props) {
		super(props);

		const {cookies} = props;
		this.state = {
			cookies: cookies,
		};
	}

	componentDidMount() {

	}

	render() {
		let user = this.state.cookies.get('user') || '';
		return (
			<div className="App">
				<Switch>
					<Route
						exact
						path="/login"
						render={(props) => {
							if (user === '') {
								return (<Login {...props} />);
							} else {
								return (<Redirect to={"/"+user} />);
							}
						}}
					/>
					<Route
						exact
						path="/"
						render={(props) => {
							return (<Redirect to="/login" />);
						}}
					/>
					<Route
						path="/:user"
						render={(props) => {
							if (user === props.match.params.user)
								return (<Chat {...props} user={props.match.params.user}/>);
							else
								return (<Redirect to="/login" />);
						}}
					/>
				</Switch>
			</div>
		);
	}
}

export default withCookies(App);
