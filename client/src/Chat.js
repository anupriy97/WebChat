import React, { Component } from 'react';
import './Chat.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';

class Chat extends Component {
	static propTypes = {
		cookies: instanceOf(Cookies).isRequired
	};

	constructor(props) {
		super(props);

		const {cookies} = props;
		this.state = {
			currMessage: '',
			currFriend: '',
			messages: [],
			friends: [],
			cookies: cookies,
			isLogged: true,
		};
	}

	componentDidMount() {
		this.callApiFriends()
			.then(res => {this.setState({ friends: res }); console.log(res);})
			.catch(err => console.log(err));

		setInterval(this.fetchMessages, 2000);
	}

	fetchMessages = () => {
		if (this.state.currFriend !== '') {
			this.getChats(this.state.currFriend);
		}
	}

	callApiFriends = async () => {
		const response = await fetch('/api/users');
		const friends = await response.json();

		if (response.status !== 200) throw Error(friends.message);

		return friends;
	};

	getChats = (friend) => {
		this.callApiMessages(friend)
			.then(chats => {this.setState({ messages: chats });})
			.catch(err => console.log(err));

		this.setState({ currFriend: friend });
	}

	callApiMessages = async (friend) => {
		const response = await fetch('/api/chats', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user: this.props.user, friend: friend }),
		});
		const resp = await response.json();

		if (response.status !== 200) {
			throw Error(resp.message);
		}
		return resp;
	}

	sendMessage = async e => {
		e.preventDefault();
		const response = await fetch('/api/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user: this.props.user, friend: this.state.currFriend, message: this.state.currMessage }),
		});
		const resp = await response.json();

		if (response.status !== 200) {
			throw Error(resp.message);
		}
		console.log("Message sent successfully...");
		this.setState({ currMessage: '' });
		this.getChats(this.state.currFriend);
	}

	logOut = e => {
		e.preventDefault();
		console.log(this);
		this.state.cookies.set('user', '', { path: '/' });
		this.setState({ isLogged: false });
	}

	render() {
		if (this.state.isLogged) {
			return (
				<div className="Chat">
					<div className="topnav">
						<div className="leftNavig">
							<div className="heading">
								React App
							</div>
							<div
								className="profile"
								onClick={() => this.setState({ currFriend: '' })}
							>
								{this.props.user}
							</div>
						</div>
						<div className="rightNavig">
							<div
								className="logOut"
								onClick={this.logOut}
							>
								<div className="img" />
								{/*<img src={logoutWhite} alt="logout" width="35"/>*/}
								{/*<span>Log Out</span>*/}
							</div>
						</div>
					</div>
					<div className="downcontent">
						<div className="sideNav">
							{this.state.friends.map(users =>
								<div
									className="friend"
									onClick={() => this.getChats(users.username)}
								>
									{(users.username === this.props.user) ? 'You' : users.username}
								</div>
							)}
						</div>
						{(this.state.currFriend !== '') &&
							<div className="ChatBox">
								<div className="currFriend">
									{(this.state.currFriend === this.props.user) ? 'You' : this.state.currFriend}
								</div>
								<div className="ChatBook">
									{this.state.messages.map(chat =>
										<div className="chat">
											{(chat.msgFrom !== this.props.user) && <span className="fromf">{chat.message}</span>}
											{(chat.msgFrom === this.props.user) && <span className="chatM">{chat.message}</span>}
										</div>
									)}
								</div>
								<div className="Write">
									<form className="form" onSubmit={this.sendMessage}>
										<input
											className="input"
											type="text"
											value={this.state.currMessage}
											onChange={e => this.setState({ currMessage: e.target.value })}
										/>
										<button className="send" type="submit">Send</button>
									</form>
								</div>
							</div>
						}
						{(this.state.currFriend === '') &&
							<div className="ChatBox">
								<span style={{ fontSize: 100 }}>Click on any friend to chat</span>
							</div>
						}
					</div>
				</div>
			);
		} else {
			return (<Redirect to="/login" />);
		}
	}
}

export default withCookies(Chat);