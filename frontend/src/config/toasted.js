import Vue from "vue";
import Toasted from "vue-toasted";

Vue.use(Toasted, {
	iconPack: "fontawesome",
	duration: 3000
});

Vue.toasted.register(
	"defaultSuccess",
	payload => (payload.msg ? payload.msg : "Operação realizada com sucesso"),
	{ type: "success", icon: "check" }
);

Vue.toasted.register(
	"defaultError",
	payload => (payload.msg ? payload.msg : "Ocorreu um erro"),
	{ type: "error", icon: "times" }
);
