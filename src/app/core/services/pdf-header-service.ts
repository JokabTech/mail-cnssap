import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PdfHeaderService {

  getHear(logo: string, pageOrientation: 'landscape' | 'portrait' = 'portrait') {
    return [
      {
        image: logo,
        width: 110,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      {
        text: `CAISSE NATIONALE DE SÉCURITÉ SOCIALE DES AGENTS \n PUBLICS DE L'ETAT`,
        style: ['headerMain'],
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0, y1: 5,
            x2: pageOrientation === 'portrait' ? 515 : 775, y2: 5,
            lineWidth: 2,
            lineColor: '#007ac3'
          },
        ],
        margin: [0, 0, 0, 10]
      },
    ]
  }

}
