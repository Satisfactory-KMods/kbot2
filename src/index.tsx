import { StrictMode } from "react";
import App            from "@app/App";
import { createRoot } from "react-dom/client";

import "@style/Ribbon.scss";
import "@style/index.css";
import "@kyri123/k-javascript-utils/lib/useAddons";
import "flowbite";

createRoot( document.getElementById( "root" ) as HTMLElement ).render(
	<StrictMode>
		<App/>
	</StrictMode>
);
