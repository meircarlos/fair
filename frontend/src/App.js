import logo from "./logo.svg";
import React from "react";
import "./App.css";
import DateTimePicker from "react-datetime-picker";
import DayJS from "dayjs";
import Modal from "react-modal";
import * as axios from "axios";
const data = require("./data.json");

const BE_BASE_URL = process.env.BE_BASE_URL || "http://localhost:3000/api/v1";

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
			collections: data.collections,
			modalIsOpen: false,
			modalInfo: {
				emailTo: "",
				index: 0,
			},
		};
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

	onNameChange(event, index) {
		console.log("onNameChange", event.target.value, index);

		const collections = [...this.state.collections];
		const collectionToUpdate = { ...collections[index] };
		collectionToUpdate.name = event.target.value;
		collections[index] = collectionToUpdate;

		this.setState({
			collections,
		});

		console.log(this.state.collections);
	}

	async onDateChange(newDate, index) {
		console.log("onDateChange", newDate, index);
		let updateDate;
		if (newDate) {
			updateDate = DayJS(newDate);
		} else {
			updateDate = null;
			this.cancelReminders(
				this.state.collections[index].id,
				this.state.collections[index].name
			);
		}

		const collections = [...this.state.collections];
		const collectionToUpdate = { ...collections[index] };
		collectionToUpdate.launchDate = updateDate;
		collections[index] = collectionToUpdate;

		this.setState({
			collections,
		});

		console.log(this.state.collections);
	}

	async cancelReminders(collectionId, collectionName) {
		await axios.delete(BE_BASE_URL + "/collections/" + collectionId);
		alert(
			`The reminders of the collection ${collectionName} have been canceled`
		);
	}

	async setReminders(index) {
		const collection = this.state.collections[index];
		if (this.state.modalInfo.emailTo) {
			await axios.post(BE_BASE_URL + "/collections/" + collection.id, {
				collectionName: collection.name,
				launchDate: collection.launchDate,
				reminders: ["1d", "1h", "30s"],
				emailTo: this.state.modalInfo.emailTo,
			});
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
							this.state.collections[this.state.modalInfo.index]
								.name
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
