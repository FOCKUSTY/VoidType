import { ObjectsLoader } from "@thevoidcommunity/the-void-database";

const objects = new ObjectsLoader().execute();

const GetObject = (type: "name" | "idea" | "download") => {
	switch (type) {
		case "name":
			return objects.name;

		case "download":
			return objects.download;

		case "idea":
			return objects.idea;

		default:
			return objects.idea;
	}
};

export default GetObject;
