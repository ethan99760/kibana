/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';

import { FtrProviderContext } from '../../ftr_provider_context';

export default function canvasExpressionTest({ getService, getPageObjects }: FtrProviderContext) {
  const testSubjects = getService('testSubjects');
  const retry = getService('retry');
  const PageObjects = getPageObjects(['canvas', 'common']);
  const find = getService('find');
  const kibanaServer = getService('kibanaServer');
  const archive = 'x-pack/test/functional/fixtures/kbn_archiver/canvas/default';

  // FLAKY: https://github.com/elastic/kibana/issues/115883
  describe.skip('expression editor', function () {
    // there is an issue with FF not properly clicking on workpad elements
    this.tags('skipFirefox');

    before(async () => {
      await kibanaServer.importExport.load(archive);

      // load test workpad
      await PageObjects.common.navigateToApp('canvas', {
        hash: '/workpad/workpad-1705f884-6224-47de-ba49-ca224fe6ec31/page/1',
      });
    });

    after(async () => {
      await kibanaServer.importExport.unload(archive);
    });

    it('updates when element is changed via side bar', async () => {
      // wait for all our elements to load up
      await retry.try(async () => {
        const elements = await testSubjects.findAll(
          'canvasWorkpadPage > canvasWorkpadPageElementContent'
        );
        expect(elements).to.have.length(4);
      });

      // find the first workpad element (a markdown element) and click it to select it
      await testSubjects.click('canvasWorkpadPage > canvasWorkpadPageElementContent', 20000);

      // open the expression editor
      await PageObjects.canvas.openExpressionEditor();

      // select markdown content and clear it
      const mdBox = await find.byCssSelector('.canvasSidebar__panel .canvasTextArea__code');
      const oldMd = await mdBox.getVisibleText();
      await mdBox.clearValueWithKeyboard();

      // type the new text
      const newMd = `${oldMd} and this is a test`;
      await mdBox.type(newMd);
      await find.clickByCssSelector('.canvasArg--controls .euiButton');

      // make sure the open expression editor also has the changes
      const editor = await find.byCssSelector('.monaco-editor .view-lines');
      const editorText = await editor.getVisibleText();
      expect(editorText).to.contain('Orange: Timelion, Server function and this is a test');

      // reset the markdown
      await mdBox.clearValueWithKeyboard();
      await mdBox.type(oldMd);
      await find.clickByCssSelector('.canvasArg--controls .euiButton');
    });
  });
}
