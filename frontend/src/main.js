import "font-awesome/css/font-awesome.css";
import Vue from "vue";

import App from "./App";

import "./config/bootstrap";
import "./config/toasted";
import store from "./config/store";
import router from "./config/router";

Vue.config.productionTip = false;

// TODO: remover
require("axios").defaults.headers.common["Authorization"] =
	"bearer " + process.env.VUE_APP_TOKEN;

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount("#app");
