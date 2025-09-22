import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PdfStylesService {
  public getStyles() {
    return {
      headerMain: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        color: '#333333',
      },

      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 5, 0, 5],
      },

      subHeader: {
        fontSize: 11,
        bold: true,
        margin: [0, 4, 0, 4],
        color: '#555555',
      },

      normal: {
        fontSize: 11,
        margin: [0, 2, 0, 2],
        color: '#444444',
      },

      bold: {
        fontSize: 11,
        bold: true,
        margin: [0, 2, 0, 2],
        color: '#222222',
      },

      label: {
        bold: true,
      },

      center: {
        alignment: 'center',
        margin: [0, 2, 0, 2],
      },

      right: {
        alignment: 'right',
        margin: [0, 2, 0, 2],
      },

      left: {
        alignment: 'left',
        margin: [0, 2, 0, 2],
      },

      sm: {
        fontSize: 9,
      },

      md: {
        fontSize: 12,
      },

      lg: {
        fontSize: 14,
      },

      xlg: {
        fontSize: 15,
      },

      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'white',
        fillColor: '#4CAF50',
        alignment: 'center',
      },

      tableCell: {
        fontSize: 11,
        margin: [3, 3, 3, 3],
      },

      blue: {
        color: '#007ac3',
      },

      spaceTop: {
        margin: [0, 10, 0, 0],
      },

      spaceBottom: {
        margin: [0, 0, 0, 10],
      },

      spaceLeft: {
        margin: [10, 0, 0, 0],
      },

      spaceRight: {
        margin: [0, 0, 10, 0],
      },

      footer: {
        fontSize: 11,
      }
    };
  }
}
