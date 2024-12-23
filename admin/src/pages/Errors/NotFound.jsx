import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';




export class NotFound extends Component {
  render() {




    return (
        <div id="error-main">
         <div class="translate-2">Error</div>
      </div>
    );
  }
}

export default withTranslate(NotFound);