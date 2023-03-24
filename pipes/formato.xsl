<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="text" indent="yes" encoding="ISO-8859-1"/>
    <xsl:template match="/">
    ARTEFACTOS NEXUS:

        <xsl:value-of select="notificaciones/text_nexus/@url"/>

    
    URL JENKINS:

        <xsl:value-of select="notificaciones/text_jenkins/@url"/>           

    </xsl:template>
</xsl:stylesheet>
