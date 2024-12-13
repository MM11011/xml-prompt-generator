document.addEventListener('DOMContentLoaded', () => {

    // Simple language dictionary
    const translations = {
        en: {
            appTitle: "Advanced XML Generator v5",
            appSubtitle: "Create files dynamically with advanced features.",
            languageLabel: "Language:",
            templateLabel: "Template:",
            importLabel: "Import XML:",
            projectDetails: "Project Details",
            projectTitle: "Project Title:",
            projectDesc: "Description:",
            versionNumber: "Version Number:",
            featuresSection: "Features",
            featuresHint: "Add, remove, and reorder features.",
            featureName: "Feature Name:",
            featureDesc: "Feature Description:",
            moveUpBtn: "Up",
            moveDownBtn: "Down",
            removeFeatureBtn: "Remove",
            addFeatureBtn: "Add Feature",
            designSection: "Design & UI Customization",
            primaryColorLabel: "Primary Color:",
            secondaryColorLabel: "Secondary Color:",
            accentColorLabel: "Accent Color:",
            fontSizeLabel: "Font Size (px):",
            borderRadiusLabel: "Border Radius (px):",
            langToolsSection: "Language and Tools",
            selectLang: "Select Programming Language:",
            toolsLabel: "Additional Libraries/Tools:",
            additionalSettingsSection: "Additional Settings",
            platformLabel: "Target Platform:",
            userGoalsLabel: "End-User Goals:",
            formatsLabel: "Supported File Formats:",
            authLabel: "Require Authentication:",
            deploymentLabel: "Deployment Preferences:",
            externalAPILabel: "Use External API:",
            apiEndpointLabel: "API Endpoint:",
            generateBtn: "Generate Output",
            generatedXML: "Generated Output",
            toggleTreeViewBtn: "Toggle Tree View",
            downloadXMLBtn: "Download File"
        },
        es: {
            appTitle: "Generador XML Avanzado v5",
            appSubtitle: "Crea archivos dinámicamente con características avanzadas.",
            languageLabel: "Idioma:",
            templateLabel: "Plantilla:",
            importLabel: "Importar XML:",
            projectDetails: "Detalles del Proyecto",
            projectTitle: "Título del Proyecto:",
            projectDesc: "Descripción:",
            versionNumber: "Número de Versión:",
            featuresSection: "Características",
            featuresHint: "Agrega, elimina y reordena características.",
            featureName: "Nombre de la Característica:",
            featureDesc: "Descripción de la Característica:",
            moveUpBtn: "Arriba",
            moveDownBtn: "Abajo",
            removeFeatureBtn: "Eliminar",
            addFeatureBtn: "Agregar Característica",
            designSection: "Diseño y Personalización de UI",
            primaryColorLabel: "Color Primario:",
            secondaryColorLabel: "Color Secundario:",
            accentColorLabel: "Color de Acento:",
            fontSizeLabel: "Tamaño de Fuente (px):",
            borderRadiusLabel: "Radio de Borde (px):",
            langToolsSection: "Lenguaje y Herramientas",
            selectLang: "Seleccionar Lenguaje de Programación:",
            toolsLabel: "Librerías/Herramientas Adicionales:",
            additionalSettingsSection: "Ajustes Adicionales",
            platformLabel: "Plataforma Objetivo:",
            userGoalsLabel: "Metas del Usuario:",
            formatsLabel: "Formatos de Archivo Soportados:",
            authLabel: "Requerir Autenticación:",
            deploymentLabel: "Preferencias de Despliegue:",
            externalAPILabel: "Usar API Externa:",
            apiEndpointLabel: "Endpoint de la API:",
            generateBtn: "Generar",
            generatedXML: "Salida Generada",
            toggleTreeViewBtn: "Alternar Vista de Árbol",
            downloadXMLBtn: "Descargar Archivo"
        }
    };

    let currentLang = 'en';
    const langSelect = document.getElementById('langSelect');
    const templateSelect = document.getElementById('templateSelect');
    const importXML = document.getElementById('importXML');
    const form = document.getElementById('projectForm');
    const featuresContainer = document.getElementById('featuresContainer');
    const addFeatureBtn = document.getElementById('addFeature');
    const outputSection = document.getElementById('outputSection');
    const outputText = document.getElementById('outputText');
    const downloadOutputBtn = document.getElementById('downloadOutput');
    const toggleTreeViewBtn = document.getElementById('toggleTreeView');
    const treeView = document.getElementById('treeView');
    const tokenCountDisplay = document.getElementById('tokenCountDisplay');
    const outputFormatSelect = document.getElementById('outputFormat');

    // Localization function
    function translateUI(lang) {
        currentLang = lang;
        const elements = document.querySelectorAll('.translatable');
        elements.forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang][key]) {
                if (el.tagName.toLowerCase() === 'input' && el.type === 'button') {
                    el.value = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });
    }

    langSelect.addEventListener('change', () => {
        translateUI(langSelect.value);
    });

    // Apply initial translation
    translateUI('en');

    // Templates
    templateSelect.addEventListener('change', applyTemplate);
    function applyTemplate() {
        const template = templateSelect.value;
        switch (template) {
            case 'webApp':
                document.getElementById('title').value = "My Web App";
                document.getElementById('description').value = "A responsive web application";
                document.getElementById('platform').value = "Web";
                document.getElementById('language').value = "JavaScript";
                document.getElementById('tools').value = "React,Axios";
                break;
            case 'dataPipeline':
                document.getElementById('title').value = "Data Pipeline Project";
                document.getElementById('description').value = "A data pipeline to ingest and transform data";
                document.getElementById('platform').value = "CLI";
                document.getElementById('language').value = "Python";
                document.getElementById('tools').value = "Pandas,Argparse";
                break;
            default:
                // Blank
                break;
        }
    }

    // Import XML
    importXML.addEventListener('change', handleImportXML);
    function handleImportXML() {
        const file = importXML.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const xmlStr = e.target.result;
            try {
                // Parse XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
                
                // Populate a few fields from imported XML (basic example)
                const importedTitle = xmlDoc.querySelector('Project > Title');
                const importedDesc = xmlDoc.querySelector('Project > Description');
                const importedVersion = xmlDoc.querySelector('Metadata > Version');
                
                if (importedTitle) document.getElementById('title').value = importedTitle.textContent;
                if (importedDesc) document.getElementById('description').value = importedDesc.textContent;
                if (importedVersion) document.getElementById('version').value = importedVersion.textContent;

                // Features (simple attempt)
                const importedFeatures = xmlDoc.querySelectorAll('Project > Features > Feature');
                // Clear existing features except one
                featuresContainer.innerHTML = '';
                importedFeatures.forEach((f) => {
                    addFeatureFromImport(
                        f.querySelector('Name') ? f.querySelector('Name').textContent : '',
                        f.querySelector('Description') ? f.querySelector('Description').textContent : ''
                    );
                });
                
            } catch (err) {
                console.error("Failed to import XML:", err);
            }
        };
        reader.readAsText(file);
    }

    function addFeatureFromImport(name, desc) {
        const featureDiv = document.createElement('div');
        featureDiv.classList.add('feature');
        featureDiv.innerHTML = `
            <label class="translatable" data-key="featureName">${translations[currentLang].featureName}</label>
            <input type="text" name="featureName" placeholder="Enter feature name" value="${name}">

            <label class="translatable" data-key="featureDesc">${translations[currentLang].featureDesc}</label>
            <textarea name="featureDescription" placeholder="Enter feature description">${desc}</textarea>

            <div class="feature-controls">
                <button type="button" class="move-up">${translations[currentLang].moveUpBtn}</button>
                <button type="button" class="move-down">${translations[currentLang].moveDownBtn}</button>
                <button type="button" class="remove-feature">${translations[currentLang].removeFeatureBtn}</button>
            </div>
        `;
        featuresContainer.appendChild(featureDiv);
        attachFeatureEventHandlers(featureDiv);
    }

    // Add a new feature block
    addFeatureBtn.addEventListener('click', () => {
        const featureDiv = document.createElement('div');
        featureDiv.classList.add('feature');
        featureDiv.innerHTML = `
            <label class="translatable" data-key="featureName">${translations[currentLang].featureName}</label>
            <input type="text" name="featureName" placeholder="Enter feature name" required>

            <label class="translatable" data-key="featureDesc">${translations[currentLang].featureDesc}</label>
            <textarea name="featureDescription" placeholder="Enter feature description" required></textarea>

            <div class="feature-controls">
                <button type="button" class="move-up">${translations[currentLang].moveUpBtn}</button>
                <button type="button" class="move-down">${translations[currentLang].moveDownBtn}</button>
                <button type="button" class="remove-feature">${translations[currentLang].removeFeatureBtn}</button>
            </div>
        `;
        featuresContainer.appendChild(featureDiv);
        attachFeatureEventHandlers(featureDiv);
    });

    function attachFeatureEventHandlers(featureDiv) {
        featureDiv.querySelector('.remove-feature').addEventListener('click', () => {
            if (featuresContainer.querySelectorAll('.feature').length > 1) {
                featureDiv.remove();
            }
        });
        featureDiv.querySelector('.move-up').addEventListener('click', () => {
            if (featureDiv.previousElementSibling) {
                featuresContainer.insertBefore(featureDiv, featureDiv.previousElementSibling);
            }
        });
        featureDiv.querySelector('.move-down').addEventListener('click', () => {
            if (featureDiv.nextElementSibling) {
                featuresContainer.insertBefore(featureDiv.nextElementSibling, featureDiv);
            }
        });
    }

    // Attach handlers to initial feature
    attachFeatureEventHandlers(featuresContainer.querySelector('.feature'));

    // On form submit, generate output
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate at least one feature
        const featureElements = featuresContainer.querySelectorAll('.feature');
        if (featureElements.length < 1) {
            alert("You must have at least one feature.");
            return;
        }

        // Validate required fields
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        if (!title || !description) {
            alert("Title and description are required.");
            return;
        }

        const version = document.getElementById('version').value.trim();
        const primaryColor = document.getElementById('primaryColor').value;
        const secondaryColor = document.getElementById('secondaryColor').value;
        const accentColor = document.getElementById('accentColor').value;
        const fontSize = document.getElementById('fontSize').value.trim();
        const borderRadius = document.getElementById('borderRadius').value.trim();

        const language = document.getElementById('language').value;
        const tools = document.getElementById('tools').value.trim();
        
        const platform = document.getElementById('platform').value;
        const userGoals = document.getElementById('userGoals').value.trim();
        const formats = document.getElementById('formats').value.trim();
        const auth = document.getElementById('auth').checked;
        const deployment = document.getElementById('deployment').value;

        const useExternalAPI = document.getElementById('useExternalAPI').checked;
        const apiEndpoint = document.getElementById('apiEndpoint').value.trim();

        const outputFormat = outputFormatSelect.value;

        // Collect features
        const features = [];
        featureElements.forEach((f) => {
            const fn = f.querySelector('input[name="featureName"]').value.trim();
            const fd = f.querySelector('textarea[name="featureDescription"]').value.trim();
            if (fn || fd) {
                features.push({name: fn, description: fd});
            }
        });

        // Data structure for output
        const data = {
            Project: {
                Title: title,
                Description: description,
                Features: features.map(feat => ({
                    Name: feat.name,
                    Description: feat.description
                })),
                Design: {
                    Theme: {
                        PrimaryColor: primaryColor,
                        SecondaryColor: secondaryColor,
                        AccentColor: accentColor
                    },
                    UI: {
                        FontSize: fontSize,
                        BorderRadius: borderRadius
                    }
                },
                TechnologyStack: {
                    Languages: [
                        { Name: "Python", UseCase: "General scripting and automation" },
                        { Name: "JavaScript", UseCase: "Web development and interactivity" },
                        { Name: "Java", UseCase: "Enterprise applications and backend services" }
                    ],
                    Libraries: [
                        { Name: "Pillow", Purpose: "Image processing" },
                        { Name: "Pandas", Purpose: "Data manipulation and CSV handling" },
                        { Name: "Argparse", Purpose: "Command-line argument parsing" }
                    ]
                },
                CodeFiles: [
                    { Name: "index.html", Type: "HTML", Content: "..." },
                    { Name: "styles.css", Type: "CSS", Content: "..." },
                    { Name: "script.js", Type: "JavaScript", Content: "..." }
                ],
                Metadata: {
                    Author: "Your Name",
                    DateCreated: new Date().toISOString().slice(0,10),
                    LastModified: new Date().toISOString().slice(0,10),
                    Version: version,
                    Notes: "Includes multiple output formats, advanced features, and token count."
                },
                AdditionalSettings: {}
            }
        };

        // Add optional fields if not removed or empty
        if (platform && platform !== 'Remove') data.Project.AdditionalSettings.Platform = platform;
        if (userGoals) data.Project.AdditionalSettings.UserGoals = userGoals;
        if (formats) data.Project.AdditionalSettings.SupportedFormats = formats;
        if (auth) data.Project.AdditionalSettings.RequireAuthentication = true;
        if (deployment && deployment !== 'Remove') data.Project.AdditionalSettings.Deployment = deployment;
        if (language) data.Project.AdditionalSettings.SelectedLanguage = language;
        if (tools) data.Project.AdditionalSettings.AdditionalTools = tools;
        if (useExternalAPI && apiEndpoint) {
            data.Project.AdditionalSettings.ExternalAPI = {
                Endpoint: apiEndpoint
            };
        }

        let outputStr = "";
        let filename = "project";
        toggleTreeViewBtn.classList.add('hidden'); // Hide tree view by default

        if (outputFormat === 'xml') {
            outputStr = generateXML(data);
            filename += ".xml";
            toggleTreeViewBtn.classList.remove('hidden');
        } else if (outputFormat === 'json') {
            outputStr = JSON.stringify(data, null, 2);
            filename += ".json";
        } else if (outputFormat === 'markdown') {
            outputStr = generateMarkdown(data);
            filename += ".md";
        }

        // Display output
        outputText.value = outputStr;
        outputSection.classList.remove('hidden');

        // Render tree view only if XML
        if (outputFormat === 'xml') {
            renderTreeView(outputStr);
        } else {
            treeView.classList.add('hidden');
        }

        // Compute and display token count
        const tokenCount = computeTokenCount(outputStr);
        tokenCountDisplay.textContent = `Estimated Token Count: ${tokenCount}`;

        // Adjust download button
        downloadOutputBtn.removeEventListener('click', downloadHandler); // Remove previous listener if any
        downloadOutputBtn.addEventListener('click', () => downloadHandler(outputStr, filename));
    });

    function downloadHandler(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Toggle Tree View
    toggleTreeViewBtn.addEventListener('click', () => {
        if (treeView.classList.contains('hidden')) {
            treeView.classList.remove('hidden');
        } else {
            treeView.classList.add('hidden');
        }
    });

    function escapeXML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    function generateXML(data) {
        const p = data.Project;

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Project>\n`;
        xml += `    <Title>${escapeXML(p.Title)}</Title>\n`;
        xml += `    <Description>${escapeXML(p.Description)}</Description>\n`;
        xml += `    <Features>\n`;
        p.Features.forEach(feature => {
            xml += `        <Feature>\n`;
            xml += `            <Name>${escapeXML(feature.Name)}</Name>\n`;
            xml += `            <Description>${escapeXML(feature.Description)}</Description>\n`;
            xml += `        </Feature>\n`;
        });
        xml += `    </Features>\n`;

        xml += `    <Design>\n`;
        xml += `        <Theme>\n`;
        xml += `            <PrimaryColor>${p.Design.Theme.PrimaryColor}</PrimaryColor>\n`;
        xml += `            <SecondaryColor>${p.Design.Theme.SecondaryColor}</SecondaryColor>\n`;
        xml += `            <AccentColor>${p.Design.Theme.AccentColor}</AccentColor>\n`;
        xml += `        </Theme>\n`;
        xml += `        <UI>\n`;
        xml += `            <FontSize>${escapeXML(p.Design.UI.FontSize)}</FontSize>\n`;
        xml += `            <BorderRadius>${escapeXML(p.Design.UI.BorderRadius)}</BorderRadius>\n`;
        xml += `        </UI>\n`;
        xml += `    </Design>\n`;

        xml += `    <TechnologyStack>\n`;
        xml += `        <Languages>\n`;
        p.TechnologyStack.Languages.forEach(lang => {
            xml += `            <Language>\n`;
            xml += `                <Name>${escapeXML(lang.Name)}</Name>\n`;
            xml += `                <UseCase>${escapeXML(lang.UseCase)}</UseCase>\n`;
            xml += `            </Language>\n`;
        });
        xml += `        </Languages>\n`;
        xml += `        <Libraries>\n`;
        p.TechnologyStack.Libraries.forEach(lib => {
            xml += `            <Library>\n`;
            xml += `                <Name>${escapeXML(lib.Name)}</Name>\n`;
            xml += `                <Purpose>${escapeXML(lib.Purpose)}</Purpose>\n`;
            xml += `            </Library>\n`;
        });
        xml += `        </Libraries>\n`;
        xml += `    </TechnologyStack>\n`;

        xml += `    <CodeFiles>\n`;
        p.CodeFiles.forEach(file => {
            xml += `        <File>\n`;
            xml += `            <Name>${escapeXML(file.Name)}</Name>\n`;
            xml += `            <Type>${escapeXML(file.Type)}</Type>\n`;
            xml += `            <Content><![CDATA[${file.Content}]]></Content>\n`;
            xml += `        </File>\n`;
        });
        xml += `    </CodeFiles>\n`;

        xml += `    <Metadata>\n`;
        xml += `        <Author>${escapeXML(p.Metadata.Author)}</Author>\n`;
        xml += `        <DateCreated>${escapeXML(p.Metadata.DateCreated)}</DateCreated>\n`;
        xml += `        <LastModified>${escapeXML(p.Metadata.LastModified)}</LastModified>\n`;
        xml += `        <Version>${escapeXML(p.Metadata.Version)}</Version>\n`;
        xml += `        <Notes>${escapeXML(p.Metadata.Notes)}</Notes>\n`;
        xml += `    </Metadata>\n`;

        xml += `    <AdditionalSettings>\n`;
        for (let key in p.AdditionalSettings) {
            let val = p.AdditionalSettings[key];
            if (typeof val === 'object') {
                // ExternalAPI case
                xml += `        <ExternalAPI>\n`;
                xml += `            <Endpoint>${escapeXML(val.Endpoint)}</Endpoint>\n`;
                xml += `        </ExternalAPI>\n`;
            } else {
                xml += `        <${key}>${escapeXML(String(val))}</${key}>\n`;
            }
        }
        xml += `    </AdditionalSettings>\n`;

        xml += `</Project>`;
        return xml;
    }

    function generateMarkdown(data) {
        const p = data.Project;
        let md = `# Project: ${p.Title}\n\n`;
        md += `**Description:** ${p.Description}\n\n`;
        md += `**Version:** ${p.Metadata.Version}\n\n`;

        md += `## Features\n`;
        p.Features.forEach(feature => {
            md += `- **${feature.Name}:** ${feature.Description}\n`;
        });
        md += `\n`;

        md += `## Design\n`;
        md += `**Primary Color:** ${p.Design.Theme.PrimaryColor}\n\n`;
        md += `**Secondary Color:** ${p.Design.Theme.SecondaryColor}\n\n`;
        md += `**Accent Color:** ${p.Design.Theme.AccentColor}\n\n`;
        md += `**Font Size:** ${p.Design.UI.FontSize}px\n\n`;
        md += `**Border Radius:** ${p.Design.UI.BorderRadius}px\n\n`;

        md += `## Technology Stack\n`;
        md += `### Languages\n`;
        p.TechnologyStack.Languages.forEach(lang => {
            md += `- **${lang.Name}:** ${lang.UseCase}\n`;
        });
        md += `\n### Libraries\n`;
        p.TechnologyStack.Libraries.forEach(lib => {
            md += `- **${lib.Name}:** ${lib.Purpose}\n`;
        });
        md += `\n`;

        md += `## Code Files\n`;
        p.CodeFiles.forEach(file => {
            md += `- **${file.Name}** [${file.Type}] Content: ...\n`;
        });
        md += `\n`;

        md += `## Metadata\n`;
        md += `- Author: ${p.Metadata.Author}\n`;
        md += `- Date Created: ${p.Metadata.DateCreated}\n`;
        md += `- Last Modified: ${p.Metadata.LastModified}\n`;
        md += `- Notes: ${p.Metadata.Notes}\n\n`;

        md += `## Additional Settings\n`;
        for (let key in p.AdditionalSettings) {
            let val = p.AdditionalSettings[key];
            if (typeof val === 'object') {
                md += `- External API Endpoint: ${val.Endpoint}\n`;
            } else {
                md += `- ${key}: ${val}\n`;
            }
        }

        return md.trim();
    }

    function renderTreeView(str) {
        const lines = str.split('\n');
        let formatted = '';
        let indent = 0;
        for (let line of lines) {
            if (line.match(/<\/\w/)) {
                indent -= 1;
            }
            formatted += '  '.repeat(indent) + line + '\n';
            if (line.match(/<\w[^>]*[^/]>.*$/) && !line.includes('<?xml')) {
                indent += 1;
            }
        }
        treeView.textContent = formatted.trim();
    }

    function computeTokenCount(str) {
        const tokens = str.split(/\s+/).filter(t => t.trim().length > 0);
        return tokens.length;
    }
});






