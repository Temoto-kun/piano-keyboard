/**
 * Script description.
 * @author TheoryOfNekomata
 * @date 2017-02-19
 */

(function tabs() {
    var tabContainers = Array.prototype.slice.call(document.querySelectorAll('.tab-container'));

    tabContainers.forEach(function initializeTabContainer(tabContainer) {
        var children = tabContainer.children,
            tabItemGroups = Array.prototype.filter.call(children, function isTab(child) { return child.classList.contains('tabs'); }),
            tabPanels = Array.prototype.filter.call(children, function isPanel(child) { return child.classList.contains('panels'); });

        function hidePanels() {
            var panels = Array.prototype.slice.call(tabPanels[0].children);

            panels.forEach(function hidePanel(panel) {
                panel.classList.remove('-active');
            });
        }

        tabItemGroups.forEach(function initializeTabItemGroup(tabItemGroup) {
            var tabItems = Array.prototype.slice.call(tabItemGroup.querySelectorAll('.tab-item'));

            function deselectTabItems() {
                tabItems.forEach(function deselectTabItem(tabItem) {
                    tabItem.classList.remove('-active');
                });
            }

            tabItems.forEach(function initializeTabItem(tabItem) {
                var link = Array.prototype.slice.call(tabItem.querySelectorAll('.link'))[0];

                link.addEventListener('click', function onItemClick(e) {
                    var target;

                    e.preventDefault();

                    target = document.getElementById(this.getAttribute('href').slice(1));

                    deselectTabItems();
                    hidePanels();
                    tabItem.classList.add('-active');
                    target.classList.add('-active');
                });
            });
        });
    });
})();
