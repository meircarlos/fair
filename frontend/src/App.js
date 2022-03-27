import logo from "./logo.svg";
import React from "react";
import "./App.css";
import DateTimePicker from "react-datetime-picker";
import DayJS from "dayjs";
import Modal from "react-modal";
import * as axios from "axios";
const defaultCollections = require("./defaultCollections");

const BE_BASE_URL = process.env.BE_BASE_URL || "http://localhost:3000/graphql";

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
};

Modal.setAppElement("#root");

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collections: [],
			modalIsOpen: false,
			modalInfo: {
				emailTo: "",
				index: 0,
			},
		};
	}

	async componentDidMount() {
		const collections = await this.fetchCollections();

		if (collections.length < 6) {
			await this.insertDefaultCollections();
		}
	}

	async fetchCollections() {
		const query = `{
			collections {
			  id,
			  name,
			  launchDate,
			  reminders {
				  id
			  }
			}
		  }`;

		const res = await axios.post(BE_BASE_URL, {
			query,
		});
		console.log(res);

		if (res.data.errors) {
			alert(res.data.errors[0].message);
			return [];
		}

		this.setState({
			collections: res.data.data.collections,
		});

		return res.data.data.collections;
	}

	async insertDefaultCollections() {
		for (const defaultCollection of defaultCollections) {
			const query = `mutation {
				createCollection(createCollectionInput: {
					name: "${defaultCollection.name}",
					launchDate: ${
						defaultCollection.launchDate
							? `"${defaultCollection.launchDate}"`
							: null
					}
				}) {
					id, name, launchDate
				}
			}`;
			const res = await axios.post(BE_BASE_URL, {
				query,
			});
			console.log(res);
			if (res.data.errors) {
				return alert(
					"Could not insert default collections => " +
						res.data.errors[0].message
				);
			}
		}

		this.fetchCollections();
	}

	openModal(index) {
		this.setState({
			modalIsOpen: true,
			modalInfo: {
				emailTo: "",
				index,
			},
		});
	}

	closeModal() {
		this.setState({
			modalIsOpen: false,
		});
	}

	onEmailToChange(event) {
		this.setState({
			modalInfo: {
				emailTo: event.target.value,
				index: this.state.modalInfo.index,
			},
		});
	}

	async onNameChange(event, index) {
		const newName = event.target.value;
		console.log("onNameChange", newName, index);
		const collections = [...this.state.collections];
		const collectionToUpdate = { ...collections[index] };

		const query = `mutation {
			updateCollection(updateCollectionInput: {
				id: ${collectionToUpdate.id},
				name: "${newName}"
			}) {
				id, name,
			}
		}`;
		const res = await axios.post(BE_BASE_URL, {
			query,
		});
		console.log(res);
		if (res.data.errors) {
			return alert(
				"Could not update the collection name => " +
					res.data.errors[0].message
			);
		}

		collectionToUpdate.name = newName;
		collections[index] = collectionToUpdate;

		this.setState({
			collections,
		});

		console.log(this.state.collections);
	}

	async onDateChange(newDate, index) {
		console.log("onDateChange", newDate, index);
		const updateDate = newDate ? DayJS(newDate) : null;

		const collections = [...this.state.collections];
		const collectionToUpdate = { ...collections[index] };

		const query = `mutation {
			updateCollection(updateCollectionInput: {
				id: ${collectionToUpdate.id},
				launchDate: ${updateDate ? `"${updateDate.format()}"` : null}
			}) {
				id, launchDate,
			}
		}`;
		const res = await axios.post(BE_BASE_URL, {
			query,
		});
		console.log(res);
		if (res.data.errors) {
			return alert(
				"Could not update the collection launch date => " +
					res.data.errors[0].message
			);
		}

		if (updateDate) {
			if (collectionToUpdate.reminders) {
				this.replaceReminders(
					this.state.collections[index].id,
					this.state.collections[index].name
				);
			}
		} else {
			this.cancelReminders(
				this.state.collections[index].id,
				this.state.collections[index].name
			);
		}

		collectionToUpdate.launchDate = updateDate;
		collections[index] = collectionToUpdate;

		this.setState({
			collections,
		});

		console.log(this.state.collections);
	}

	async replaceReminders(collectionId, collectionName) {
		const query = `mutation {
			replaceReminders(collectionId: ${collectionId}) {
				id
			}
		}`;
		const res = await axios.post(BE_BASE_URL, {
			query,
		});
		if (res.data.errors) {
			return alert(
				res.data.errors[0].message +
					"\nSet the reminders by clicking the Remind Me button"
			);
		}

		alert(
			`The reminders of the collection ${collectionName} have been replaced`
		);
	}

	async cancelReminders(collectionId, collectionName) {
		const query = `mutation {
			cancelReminders(collectionId: ${collectionId})
		}`;
		const res = await axios.post(BE_BASE_URL, {
			query,
		});
		console.log(res);
		if (res.data.errors) {
			return alert(res.data.errors[0].message);
		}
		alert(
			`The reminders of the collection ${collectionName} have been canceled`
		);
	}

	async setReminders(index) {
		const collection = this.state.collections[index];
		if (this.state.modalInfo.emailTo) {
			const query = `mutation {
				setReminders(collectionId: ${collection.id}, emailTo: "${this.state.modalInfo.emailTo}") {
					id
				  }
				}`;
			console.log(query);
			const res = await axios.post(BE_BASE_URL, {
				query,
			});
			console.log(res);
			if (res.data.errors) {
				return alert(res.data.errors[0].message);
			}
			collection.reminders = true;
			alert(
				`The reminders for the collection ${collection.name} have been set`
			);
		} else {
			alert(`The collection ${collection.name} is missing an email`);
		}

		this.closeModal();
	}

	loadCollections() {
		return (
			<div>
				{this.state.collections.map((collection, index) => {
					return (
						<div key={index} style={{ margin: "30px" }}>
							<div>
								Name:{" "}
								<input
									value={collection.name}
									onChange={(event) =>
										this.onNameChange(event, index)
									}
								></input>
							</div>
							<div>
								Launch Date:{" "}
								<DateTimePicker
									onChange={(newDate) =>
										this.onDateChange(newDate, index)
									}
									value={
										collection.launchDate
											? new Date(collection.launchDate)
											: null
									}
								/>
							</div>
							<button
								onClick={() => this.openModal(index)}
								disabled={!collection.launchDate}
							>
								Remind Me
							</button>
						</div>
					);
				})}
				<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={() => this.closeModal()}
					style={customStyles}
				>
					<p>
						Set 1d/1h/30m reminders for collection:{" "}
						{
							this.state.collections?.[this.state.modalInfo.index]
								?.name
						}
					</p>
					<input
						type="email"
						placeholder="a@b.com"
						value={this.state.modalInfo.emailTo}
						onChange={(event) => this.onEmailToChange(event)}
					></input>
					<button
						onClick={() =>
							this.setReminders(this.state.modalInfo.index)
						}
					>
						Submit
					</button>
					<button onClick={() => this.closeModal()}>close</button>
				</Modal>
			</div>
		);
	}
	render() {
		return <div>{this.loadCollections()}</div>;
	}
}

export default App;
