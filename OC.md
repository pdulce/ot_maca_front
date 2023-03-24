1. Login to giss OpenShift
    $ oc login https://api.giss.int.portal.ss:6443 --username=99GU8520
    $ password: ********
2. Change to MACA project
    $ oc project gint-ot-maca
3. List pods
    $ oc get pods
4. Go in to the project via bash
    $ oc exec maca-front-7f4848b5f9-wrdj8 -it -c nginx-unprivileged -- bash
    $ cd /usr/share/nginx/html
    $ exit
5. Copy from local giss
    $ cd C:\Users\99GU8520\Documents\MAD\ot_maca_front
    $ oc cp dist/mad-app/. maca-front-7f4848b5f9-wrdj8:/usr/share/nginx/html -c nginx-unprivileged
    $ then (do step 4) to check