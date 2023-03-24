import frmwork.EnvironmentsTypes
import frmwork.tools.Configuracion
import frmwork.tools.entornos.EnvDeploy
import frmwork.tools.Helm

// Funciona de arranque del proceso de compilacion
// devuelve 0 si OK  y <>0 si ERROR
def start() {
    log.info "[BUILD-start.groovy] COMPILE"

    Configuracion conf = Configuracion.instance
    String entorno = EnvDeploy.get().getEntornoDespliegue()
    String ent = "${entorno}".toLowerCase()
    // Para completar pasos en fase build, aunque sean pasos de deploy, se toma como entorno int en las siguiente condiciones
    //         Entorno es desarorllo
    //        No hay que realizar el despliegue
    if(entorno == EnvironmentsTypes.Value.NO_DESPLIEGUE) {
        ent = "int"
    }

    sh "pwd"
    sh "ls -al"

    /*    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDENTIALSID}",
            passwordVariable: 'NEXUS_PASS', usernameVariable: 'NEXUS_USER')]) {
        sh 'set +x && echo "\n_auth=\$(echo -n "\${NEXUS_USER}:\${NEXUS_PASS}" | base64)" >> .npmrc'
    } */
    
   /* sh "npm whoami"
    sh "npm config set strict-ssl false"
    sh "npm config set registry=https://nexus-gpro-co-dvo.apps.giss.pro.portal.ss/repository/ot__group_npm/"
    sh "npm config set noproxy=${NO_PROXY}" */

    configFileProvider(
		[configFile(fileId: 'frontend-settings', variable: 'FRONTEND_SETTINGS')]) {
        sh"""
            npm config set prefix '~/.npm-global'
            export PATH=~/.npm-global/bin:$PATH
            npm install -g @angular/cli
            npm list -g @angular/cli
            npm install --force
            npm run build-${ent}
        """
    }

    def dirA = frmwork.Dirs.getDirA()
    log.info "[BUILD-start.groovy] Directorio a: ${dirA}"

    sh "du ${WORKSPACE}/dist"
    sh "mv ${WORKSPACE}/dist/* ${dirA}/."
    sh "ls -l ${dirA}/"

    log.info("[BACKEND/build] Inicio de proceso helm para POC avro-kafka.")
	Helm.generarArtefactoByArtifactsHelm_Xml()
	log.info("[BACKEND/build] Fin de proceso helm para POC avro-kafka.")


    return 0;  
}

return this;
