﻿module armExplorer {

    class MockResourceHandlerResolver implements IResourceHandlerResolver {
        constructor(private resourceHandler: ICliResource) {
        }

        getResourceHandler(resType: CliResourceType): ICliResource {
            return this.resourceHandler;
        }
    }

    namespace CliScriptGeneratorTests {

        scriptSubscriptions();
        scriptSubscription();
        scriptSubscriptionLocations();
        scriptResourceGroups();
        scriptResourceGroup();
        scriptWebApps();
        scriptWebApp();
        scriptGenericResource();

        function scriptSubscriptions() {
            let resourceDefinition = {} as IResourceDefinition;
            resourceDefinition.actions = ["GET"];
            resourceDefinition.apiVersion = "2014-04-01";
            resourceDefinition.children = "{name}";

            let value = {} as ISelectHandlerReturn;
            value.httpMethod = "GET";
            value.url = "https://management.azure.com/subscriptions";
            value.resourceDefinition = resourceDefinition;

            let parser = new ARMUrlParser(value,[]);
            let resolver: armExplorer.ScriptParametersResolver = new armExplorer.ScriptParametersResolver(parser);
            let resourceHandlerResolver = new MockResourceHandlerResolver(new Subscriptions(resolver));
            let scriptor: CliScriptGenerator = new CliScriptGenerator(resolver, resourceHandlerResolver);
            throwIfNotEqual(CliResourceType.Subscriptions, scriptor.getCliResourceType());

            const expected = "az account list\n\n";
            throwIfNotEqual(expected, scriptor.getScript());

            logSuccess(arguments);
    
        }
        
        function scriptSubscription() {
            let resourceDefinition = {} as IResourceDefinition;
            resourceDefinition.actions = ["GET"];
            resourceDefinition.apiVersion = "2014-04-01";
            resourceDefinition.children = "{name}";

            let value = {} as ISelectHandlerReturn;
            value.httpMethod = "GET";
            value.url = "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000";
            value.resourceDefinition = resourceDefinition;

            let parser = new ARMUrlParser(value,[]);
            let resolver: armExplorer.ScriptParametersResolver = new armExplorer.ScriptParametersResolver(parser);
            let resourceHandlerResolver = new MockResourceHandlerResolver(new Subscription(resolver));
            let scriptor: CliScriptGenerator = new CliScriptGenerator(resolver, resourceHandlerResolver);
            throwIfNotEqual(CliResourceType.Subscription, scriptor.getCliResourceType());

            const expected = "az account show --subscription 00000000-0000-0000-0000-000000000000\n\n";
            throwIfNotEqual(expected, scriptor.getScript());

            logSuccess(arguments);
        }

        function scriptResourceGroups() {
            let resourceDefinition = {} as IResourceDefinition;
            resourceDefinition.actions = ["GET", "CREATE"];
            resourceDefinition.apiVersion = "2014-04-01";
            resourceDefinition.children = "{name}";

            let value = {} as ISelectHandlerReturn;
            value.httpMethod = "GET";
            value.url = "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups";
            value.resourceDefinition = resourceDefinition;

            let parser = new ARMUrlParser(value,[]);
            let resolver: armExplorer.ScriptParametersResolver = new armExplorer.ScriptParametersResolver(parser);
            let resourceHandlerResolver = new MockResourceHandlerResolver(new ResourceGroups(resolver));
            let scriptor: CliScriptGenerator = new CliScriptGenerator(resolver, resourceHandlerResolver);

            throwIfNotEqual(CliResourceType.ResourceGroups, scriptor.getCliResourceType());

            const expectedScriptGet = "az group list\n\n";
            const expectedScriptNew = "az group create --location westus --name NewResourceGroupName\n\n";
            throwIfNotEqual(expectedScriptGet + expectedScriptNew , scriptor.getScript());

            logSuccess(arguments);
        }

        function scriptResourceGroup() {
            let resourceDefinition = {} as IResourceDefinition;
            resourceDefinition.actions = ["GET", "PUT", "DELETE"];
            resourceDefinition.apiVersion = "2014-04-01";
            resourceDefinition.children = ["exportTemplate", "moveResources", "providers", "validateMoveResources"];

            let actions = [] as IAction[];
            actions[0] = { httpMethod: "DELETE", name: "Delete", url: "https://management.azure.com/subscriptions/6e6e25b…-43f4-bdde-1864842e524b/resourceGroups/cloudsvcrg", query: undefined, requestBody: undefined };
            actions[1] = { httpMethod: "POST", name: "exportTemplate", url: "https://management.azure.com/subscriptions/6e6e25b…842e524b/resourceGroups/cloudsvcrg/exportTemplate", query: undefined, requestBody: '{"options": "IncludeParameterDefaultValue, IncludeComments", "resources": ["* "]}' };
            actions[2] = { httpMethod: "POST", name: "moveResources", url: "https://management.azure.com/subscriptions/6e6e25b…842e524b/resourceGroups/cloudsvcrg/moveResources", query: undefined, requestBody: '{"targetResourceGroup": "(string)","resources": ["(string)"]}' };
            actions[3] = { httpMethod: "POST", name: "validateMoveResources", url: "https://management.azure.com/subscriptions/6e6e25b…842e524b/resourceGroups/cloudsvcrg/validateMoveResources", query: undefined, requestBody: '{"targetResourceGroup": "(string)","resources": ["(string)"]}' };

            let value = {} as ISelectHandlerReturn;
            value.httpMethod = "GET";
            value.url = "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/cloudsvcrg";
            value.resourceDefinition = resourceDefinition;

            let parser = new ARMUrlParser(value,actions);
            let resolver: armExplorer.ScriptParametersResolver = new armExplorer.ScriptParametersResolver(parser);
            let resourceHandlerResolver = new MockResourceHandlerResolver(new ResourceGroup(resolver));
            let scriptor: CliScriptGenerator = new CliScriptGenerator(resolver, resourceHandlerResolver);

            throwIfNotEqual(CliResourceType.ResourceGroup, scriptor.getCliResourceType());

            const expectedScriptGet = 'az group show --name "cloudsvcrg"\n\n';
            const expectedScriptSet = 'az group update --name "cloudsvcrg" <properties>\n\n';
            const expectedScriptRemove = 'az group delete --name "cloudsvcrg"\n\n';
            throwIfNotEqual(expectedScriptGet + expectedScriptSet + expectedScriptRemove, scriptor.getScript());

            logSuccess(arguments);
        }

        function scriptWebApps() {
            let resourceDefinition = {} as IResourceDefinition;
            resourceDefinition.actions = ["GET", "CREATE"];
            resourceDefinition.apiVersion = "2014-03-01";
            resourceDefinition.children = "{name}";

            let value = {} as ISelectHandlerReturn;
            value.httpMethod = "GET";
            value.url = "https://management.azure.com/subscriptions/6e6e25b9-3ade-43f4-bdde-1864842e524b/resourceGroups/rgrp1/providers/Microsoft.Web/sites";
            value.resourceDefinition = resourceDefinition;

            let parser = new ARMUrlParser(value, []);
            let resolver: armExplorer.ScriptParametersResolver = new armExplorer.ScriptParametersResolver(parser);
            let resourceHandlerResolver = new MockResourceHandlerResolver(new WebApps(resolver));
            let scriptor: CliScriptGenerator = new CliScriptGenerator(resolver, resourceHandlerResolver);

            throwIfNotEqual(CliResourceType.WebApps, scriptor.getCliResourceType());

            const expectedScriptGet = 'az webapp list --resource-group "rgrp1"\n\n';
            const expectedScriptNew = 'az webapp create --resource-group "rgrp1" --plan planName --name NewWebAppName\n\n';
            throwIfNotEqual(expectedScriptGet + expectedScriptNew, scriptor.getScript());

            logSuccess(arguments);
        }

        function scriptWebApp() {
            let resourceDefinition = {} as IResourceDefinition;
            resourceDefinition.actions = ["GET", "DELETE", "PUT", "CREATE"];
            resourceDefinition.apiVersion = "2016-03-01";
            resourceDefinition.children = "{name}";

            let value = {} as ISelectHandlerReturn;
            value.httpMethod = "GET";
            value.url = "https://management.azure.com/subscriptions/6e6e25b9-3ade-43f4-bdde-1864842e524b/resourceGroups/rgrp1/providers/Microsoft.Web/sites/xdfxdfxdfxdf";
            value.resourceDefinition = resourceDefinition;

            let parser = new ARMUrlParser(value, []);
            let resolver: armExplorer.ScriptParametersResolver = new armExplorer.ScriptParametersResolver(parser);
            let resourceHandlerResolver = new MockResourceHandlerResolver(new WebApp(resolver));
            let scriptor: CliScriptGenerator = new CliScriptGenerator(resolver, resourceHandlerResolver);

            throwIfNotEqual(CliResourceType.WebApp, scriptor.getCliResourceType());

            const expectedScriptGet = 'az webapp show --name "xdfxdfxdfxdf" --resource-group "rgrp1"\n\n';
            const expectedScriptSet = 'az resource update --id /subscriptions/6e6e25b9-3ade-43f4-bdde-1864842e524b/resourceGroups/rgrp1/providers/Microsoft.Web/sites/xdfxdfxdfxdf --api-version 2016-03-01 --set properties.key=value\n\n'
            const expectedScriptNew = 'az webapp create --resource-group "rgrp1" --plan planName --name NewWebAppName\n\n';
            throwIfNotEqual(expectedScriptGet + expectedScriptSet + expectedScriptNew, scriptor.getScript());

            logSuccess(arguments);
        }

        function scriptGenericResource() {
            let resourceDefinition = {} as IResourceDefinition;
            resourceDefinition.actions = ["GET", "PUT", "DELETE"];
            resourceDefinition.apiVersion = "2016-04-01";
            resourceDefinition.children = ["slots"];

            let actions = [] as IAction[];
            actions[0] = { httpMethod: "DELETE", name: "Delete", url: "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/cloudsvcrg/providers/Microsoft.ClassicCompute/domainNames/x123cloudsvc", query: undefined, requestBody: undefined };

            let value = {} as ISelectHandlerReturn;
            value.httpMethod = "GET";
            value.url = "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/cloudsvcrg/providers/Microsoft.ClassicCompute/domainNames/x123cloudsvc";
            value.resourceDefinition = resourceDefinition;
            let resolver = new armExplorer.ScriptParametersResolver(new ARMUrlParser(value, actions));
            let resourceHandlerResolver = new MockResourceHandlerResolver(new GenericResource(resolver));
            let scriptor: CliScriptGenerator = new CliScriptGenerator(resolver, resourceHandlerResolver);

            throwIfNotEqual(CliResourceType.GenericResource, scriptor.getCliResourceType());

            const expectedScriptGet = 'az resource show --id /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/cloudsvcrg/providers/Microsoft.ClassicCompute/domainNames/x123cloudsvc --api-version 2016-04-01\n\n';
            const expectedScriptSet = 'az resource update --id /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/cloudsvcrg/providers/Microsoft.ClassicCompute/domainNames/x123cloudsvc --api-version 2016-04-01 --set properties.key=value\n\n';
            const expectedScriptDelete = 'az resource delete --id /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/cloudsvcrg/providers/Microsoft.ClassicCompute/domainNames/x123cloudsvc --api-version 2016-04-01\n\n';
            throwIfNotEqual(expectedScriptGet + expectedScriptSet + expectedScriptDelete, scriptor.getScript());

            logSuccess(arguments);
        }

        function scriptSubscriptionLocations() {
            let resourceDefinition = {} as IResourceDefinition;
            resourceDefinition.actions = ["GET"];
            resourceDefinition.apiVersion = "2014-04-01";

            let value = {} as ISelectHandlerReturn;
            value.httpMethod = "GET";
            value.url = "https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/locations";
            value.resourceDefinition = resourceDefinition;
            

            let parser = new ARMUrlParser(value,[]);
            let resolver: armExplorer.ScriptParametersResolver = new armExplorer.ScriptParametersResolver(parser);
            let resourceHandlerResolver = new MockResourceHandlerResolver(new SubscriptionLocations(resolver));
            let scriptor: CliScriptGenerator = new CliScriptGenerator(resolver, resourceHandlerResolver);
            throwIfNotEqual(CliResourceType.SubscriptionLocations, scriptor.getCliResourceType());
            const expectedScript = "az account list-locations\n\n";
            throwIfNotEqual(expectedScript, scriptor.getScript());

            logSuccess(arguments);
        }
    }
}