import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stock-search';
  isCollapsed = true;

  search_clicked(){
    let sid = document.getElementById('src')
    let wid = document.getElementById('watch')
    let pid = document.getElementById('port')

    wid.style.border = 'none'
    pid.style.border = 'none'
    sid.style.border = 'white solid'
    document.getElementById('slink').style.color = 'white'
    document.getElementById('wlink').removeAttribute('style')
    document.getElementById('plink').removeAttribute('style')
    
    this.isCollapsed = !this.isCollapsed
  }

  watch_clicked(){
    let sid = document.getElementById('src')
    let wid = document.getElementById('watch')
    let pid = document.getElementById('port')

    sid.style.border = 'none'
    pid.style.border = 'none'
    wid.style.border = 'white solid'
    document.getElementById('wlink').style.color = 'white'
    document.getElementById('slink').removeAttribute('style')
    document.getElementById('plink').removeAttribute('style')

    this.isCollapsed = !this.isCollapsed
  }

  port_clicked(){
    let sid = document.getElementById('src')
    let wid = document.getElementById('watch')
    let pid = document.getElementById('port')

    sid.style.border = 'none'
    wid.style.border = 'none'
    pid.style.border = 'white solid'
    document.getElementById('plink').style.color = 'white'
    document.getElementById('wlink').removeAttribute('style')
    document.getElementById('slink').removeAttribute('style')

    this.isCollapsed = !this.isCollapsed
  }
}
