import frmwork.tools.Helm

// Funcion de arranque del proceso de despliegue de desarrollo
// devuelve 0 si OK  y <>0 si ERROR
def start(pathVersion , def pathConf="") {
	log.info "CER->start"

	log.info("[BACKEND/build] Inicio de ejecucion helm.")
	Helm.execChartByArtifactsHelm_Xml()
	log.info("[BACKEND/build] Fin de ejecucion helm.")

	return 0;
}
return this;
