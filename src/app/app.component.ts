import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'saxon-uni-22_03';

  // mia parte
  xsltFC = new FormControl('');
  xmlFC = new FormControl('');
  resultFC = new FormControl('');
  sefFC = new FormControl('');

  constructor(
    private http: HttpClient
  ) {
    this.xsltFC.valueChanges.subscribe(($value: string) => {

    });
  }

  getXData($xmlOrsef: string) {
    const xml = this.xmlFC.value;
    const xsl = this.xsltFC.value;
    let hpath: string = '';
    // inizializzo
    this.resultFC.patchValue('[val.result] *** loading');
    // inizializzo
    this.sefFC.patchValue('[val.sef] *** loading');
    // console.log('dddd', xml, xsl);
    // this.resultFC.patchValue(xml);
    // ub-dev01.local.intranet
    // this.http.post("http://ub-dev01.local.intranet:4224/saxon",
    switch ($xmlOrsef) {
      case 'ALL': hpath = 'xslt';
        break;
      case 'ONLY-SEF': hpath = 'sef';
        break;
    }
    this.http.post(`/saxon/${hpath}`,
      {
        "xml": xml,   // in sef sended even not read from api
        "xslt": xsl,
      }).subscribe(
        (val: any) => {
          console.log("POST call successful value returned in body");
          // arriva { result: , sef: }
          console.log(val, Buffer.from(val.result.data).toString());
          // arriva Buffer
          /*
           const copy = JSON.parse(json, (key, value) => {
            return value &#x26;&#x26; value.type === 'Buffer' ?
              Buffer.from(value) :
              value;
          });
          */
          this.resultFC.patchValue(Buffer.from(val.result.data).toString());
          this.sefFC.patchValue(Buffer.from(val.sef.data).toString());
        },
        response => {
          console.log("POST call in error", response);
        },
        () => {
          console.log("The POST observable is now completed.");
        });
  }

}


